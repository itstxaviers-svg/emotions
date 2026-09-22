import type { AppSettings, BackupFile, DayData } from './types';

const DB_NAME = 'tikhiy-den';
const STORE = 'app';
const DAYS_KEY = 'days';
const SETTINGS_KEY = 'settings';

export const defaultSettings: AppSettings = { theme:'system', reduceMotion:false, favoriteEmotions:[], favoriteStates:[], recentEmotions:[], hiddenEmotions:[], hiddenStates:[], customStates:[], customEmotions:[] };

const openDb = () => new Promise<IDBDatabase>((resolve,reject) => {
  const request = indexedDB.open(DB_NAME, 1);
  request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE); };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error);
});

const read = async <T>(key:string, fallback:T): Promise<T> => {
  const db = await openDb();
  return new Promise((resolve,reject) => {
    const req = db.transaction(STORE,'readonly').objectStore(STORE).get(key);
    req.onsuccess=()=>resolve((req.result as T) ?? fallback); req.onerror=()=>reject(req.error);
  });
};
const write = async <T>(key:string,value:T) => {
  const db = await openDb();
  return new Promise<void>((resolve,reject) => {
    const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(value,key); tx.oncomplete=()=>resolve(); tx.onerror=()=>reject(tx.error);
  });
};

export interface JournalStorage {
  getDay(date:string): Promise<DayData|null>;
  saveDay(day:DayData): Promise<void>;
  getAllDays(): Promise<DayData[]>;
  getDaysInRange(start:string,end:string):Promise<DayData[]>;
  getSettings():Promise<AppSettings>;
  saveSettings(settings:AppSettings):Promise<void>;
  exportAll():Promise<BackupFile>;
  importAll(backup:BackupFile,strategy:'merge'|'replace'):Promise<void>;
  clearAll():Promise<void>;
}

const mergeDays = (local:DayData[], incoming:DayData[]) => {
  const map = new Map(local.map(d=>[d.date,d]));
  incoming.forEach(remote => {
    const here=map.get(remote.date);
    if(!here){ map.set(remote.date,remote); return; }
    const entries=new Map(here.entries.map(e=>[e.id,e]));
    remote.entries.forEach(e=>{ const old=entries.get(e.id); if(!old || e.updatedAt>old.updatedAt) entries.set(e.id,e); });
    const color = remote.color && (!here.color || remote.updatedAt>here.updatedAt) ? remote.color : here.color;
    map.set(remote.date,{...here,color,entries:[...entries.values()].sort((a,b)=>a.timestamp.localeCompare(b.timestamp)),updatedAt: here.updatedAt>remote.updatedAt?here.updatedAt:remote.updatedAt});
  });
  return [...map.values()].sort((a,b)=>a.date.localeCompare(b.date));
};

export const journalStorage:JournalStorage = {
  async getDay(date){ return (await read<DayData[]>(DAYS_KEY,[])).find(d=>d.date===date) ?? null; },
  async saveDay(day){ const days=await this.getAllDays(); const ix=days.findIndex(d=>d.date===day.date); if(ix>=0)days[ix]=day;else days.push(day); await write(DAYS_KEY,days); },
  getAllDays(){ return read<DayData[]>(DAYS_KEY,[]); },
  async getDaysInRange(start,end){ return (await this.getAllDays()).filter(d=>d.date>=start&&d.date<=end); },
  async getSettings(){ return {...defaultSettings,...await read<AppSettings>(SETTINGS_KEY,defaultSettings)}; },
  saveSettings(settings){ return write(SETTINGS_KEY,settings); },
  async exportAll(){ const settings=await this.getSettings(); return {schemaVersion:1,exportedAt:new Date().toISOString(),appVersion:'1.0.0',days:await this.getAllDays(),settings,customEmotions:settings.customEmotions,customStates:settings.customStates}; },
  async importAll(backup,strategy){
    const days=strategy==='replace'?backup.days:mergeDays(await this.getAllDays(),backup.days);
    const settings=strategy==='replace'?backup.settings:{...await this.getSettings(),...backup.settings,customEmotions:[...(await this.getSettings()).customEmotions,...backup.customEmotions].filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i),customStates:[...(await this.getSettings()).customStates,...backup.customStates].filter((v,i,a)=>a.findIndex(x=>x.id===v.id)===i)};
    await write(DAYS_KEY,days); await write(SETTINGS_KEY,settings);
  },
  async clearAll(){ await write(DAYS_KEY,[]); await write(SETTINGS_KEY,defaultSettings); }
};

export function validateBackup(raw:unknown): BackupFile {
  if(!raw || typeof raw!=='object') throw new Error('Файл не похож на резервную копию.');
  const b=raw as Partial<BackupFile>;
  if(b.schemaVersion!==1) throw new Error('Этот файл создан в несовместимой версии приложения.');
  if(!Array.isArray(b.days)||!b.settings||!Array.isArray(b.customEmotions)||!Array.isArray(b.customStates)) throw new Error('Структура файла не соответствует резервной копии приложения.');
  for(const d of b.days){
    if(!d||typeof d.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(d.date)||!Array.isArray(d.entries)) throw new Error('В файле есть повреждённые данные дня.');
    if(d.color && (!/^#[0-9a-f]{6}$/i.test(d.color.hex)||d.color.hsl.h<0||d.color.hsl.h>360||d.color.hsl.s<0||d.color.hsl.s>100||d.color.hsl.l<0||d.color.hsl.l>100)) throw new Error('В файле указан некорректный цвет.');
    for(const e of d.entries){
      if(!e.id||Number.isNaN(Date.parse(e.timestamp))||!Array.isArray(e.emotions)||!Array.isArray(e.states)) throw new Error('В файле есть повреждённая отметка.');
      const intensities=[...e.emotions,...e.states].map(x=>x.intensity).filter(Boolean) as number[];
      if(intensities.some(i=>i<1||i>5)) throw new Error('Интенсивность должна быть от 1 до 5.');
    }
  }
  return b as BackupFile;
}
