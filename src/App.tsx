import React, { useState, useEffect } from 'react';
import Navbar from './components/navbar/Navbar';
import List from './components/list/List';
import './App.css';
import { RecoilRoot } from 'recoil';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from './components/layout/themes';
import { SplitPane } from 'react-multi-split-pane';

function App() {
  const [theme, setTheme] = useState<null | string>(null);


  useEffect(() => {
    window.Main.invoke('setTheme', theme).then((res)=>{
    });
  }, [theme]);

  useEffect(() => {
    if(!theme)
    window.Main.invoke('getTheme').then((res:string) => {
      if (res) setTheme(res);
    });
  }, []);

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        <div>
          <SplitPane split="vertical" minSize={250} defaultSizes={[100, 250]}>
            

            <Navbar state={theme} setState={setTheme} />
            <List />
          </SplitPane>
        </div>
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;
