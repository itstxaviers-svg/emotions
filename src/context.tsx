import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { journalStorage } from './storage';
import type { AppSettings, DayData } from './types';
import { defaultSettings } from './storage';

type Ctx={days:DayData[];settings:AppSettings;loading:boolean;saveDay:(d:DayData)=>Promise<void>;saveSettings:(s:AppSettings)=>Promise<void>;refresh:()=>Promise<void>};
const JournalContext=createContext<Ctx|null>(null);
export function JournalProvider({children}:{children:ReactNode}){
  const [days,setDays]=useState<DayData[]>([]);const [settings,setSettings]=useState(defaultSettings);const [loading,setLoading]=useState(true);
  const refresh=useCallback(async()=>{const [d,s]=await Promise.all([journalStorage.getAllDays(),journalStorage.getSettings()]);setDays(d);setSettings(s);setLoading(false)},[]);
  useEffect(()=>{refresh()},[refresh]);
  useEffect(()=>{document.documentElement.dataset.theme=settings.theme;document.documentElement.dataset.reduceMotion=String(settings.reduceMotion)},[settings]);
  const saveDay=async(d:DayData)=>{await journalStorage.saveDay(d);setDays(old=>[...old.filter(x=>x.date!==d.date),d].sort((a,b)=>a.date.localeCompare(b.date)))};
  const saveSettings=async(s:AppSettings)=>{await journalStorage.saveSettings(s);setSettings(s)};
  const value=useMemo(()=>({days,settings,loading,saveDay,saveSettings,refresh}),[days,settings,loading]);
  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}
export const useJournal=()=>{const c=useContext(JournalContext);if(!c)throw new Error('JournalProvider missing');return c};
