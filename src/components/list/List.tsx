import React, { useEffect, useState, useRef, useReducer } from 'react';
import { ListStyled, GridStyled, GridStyledHeader, Title } from './ListStyles';
import FormComp from '../form/Form';
import { IconDeviceFloppy, IconSquareX, IconTrash, IconFileExport } from '@tabler/icons';
import { projectState, submittingState } from '../states';
import { useRecoilState } from 'recoil';
import ReactTooltip from 'react-tooltip';


type ActionType =
  | { type: 'UPDATE'; prevKey: string; key: string; val: string | number }
  | { type: 'DELETE'; key: string }
  | { type: 'SET'; }
  | { type: 'FETCH_SET'; s: string[][] };

export default function List() {
  const [project] = useRecoilState(projectState);
  const [sending, setSending] = useRecoilState(submittingState);
  const [langs, setLangs] = useState<string[]>([]);
  const [lang, setLang] = useState<string | null>(null);
  const [state, dispatch] = useReducer((state: string[][], action: ActionType) => {
    switch (action.type) {
      case 'SET':
        window.Main.invoke('getOneProject', {id:project, anotherLang : lang ?? undefined}).then((arg: { string: string }) => {
          dispatch({ type: 'FETCH_SET', s: [...Object.entries(arg)] });
        });
        return state;
      case 'FETCH_SET':
        return action.s;
      case 'DELETE':
        setSending(true);

        window.Main.invoke('deleteEntry', { key: action.key, id: project, anotherLang: lang ?? undefined }).then(() => {
          setSending(false);
        });
        return state as string[][];

      case 'UPDATE':
        setSending(true);

        window.Main.invoke('updateContent', {
          key: action.key,
          val: action.val,
          id: project,
          prevKey: action.prevKey,
          anotherLang:lang ?? undefined
        }).then(() => {
          setSending(false);
        });
        return state as string[][];
      default:
        throw new Error();
    }
  }, []);

  const editedKey = useRef<HTMLInputElement[]>([]);
  const editedVal = useRef<HTMLInputElement[]>([]);

  const updateContent = (prevKey: string, i: number) => {
    if (editedKey.current[i] && editedVal.current[i]) {
      dispatch({
        type: 'UPDATE',
        key: editedKey.current[i].value,
        val: editedVal.current[i].value,
        
        prevKey
      });
    }
  };

  const restoreContent = (prevKey: string, prevVal: string, i: number) => {
    console.log("restoring")
    editedKey.current[i].value = prevKey;
    editedVal.current[i].value = prevVal;
  };

  const deleteEntry = (key: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    dispatch({ type: 'DELETE', key });

  }

  const deleteProject = () => {
    if (project) {
      if (!window.confirm('Are you sure you want to delete this project?')) return;
      setSending(true);

      window.Main.invoke('deleteOneProject', project).then(() => setSending(false));
    }
  };

  const exportProject = () => {
    if (project) {
      setSending(true);
      window.Main.invoke('exportProject', project).then((data) => {
        for (const lang in data) {
          const fileName = lang;
          const json = JSON.stringify(data[lang]);
          const blob = new Blob([json], { type: 'application/json' });
          const href = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = href;
          link.download = fileName + '.json';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
        setSending(false);
      });
    }
  };

  useEffect(() => {
    if (lang) dispatch({ type: 'SET' });
   
  }, [lang]);

  useEffect(() => {
    if (project) {
      window.Main.invoke('getLangs', project).then((arg) => {
        setLangs(arg);
      });
      dispatch({ type: 'SET' });
    }
  }, [project, sending]);

  return (
    <ListStyled>
      {!project && <h1 className="title">Select a project</h1>}
      {project && (
        <>
          <Title>
            <h1 className="title">{project}</h1>{' '}
            <i>
              {' '}
              <span data-tip="Remove project">
                <IconTrash onClick={() => deleteProject()} />{' '}
                <ReactTooltip place="top" effect="solid" className="info-span" />
              </span>
            </i>
            <i>
              <span data-tip="Export project">
                {' '}
                <IconFileExport onClick={() => exportProject()} />{' '}
                <ReactTooltip place="top" effect="solid" className="info-span" />
              </span>
            </i>
          </Title>
          <FormComp project={project} langs={langs} setLang={setLang} lang={lang} />

          <GridStyledHeader>
            <span>Key</span>
            <span>Translation</span>
          </GridStyledHeader>
          <div className="listContent">
            {state.map((data, i) => {
              // console.log(1, data);
              editedKey.current = [];
              editedVal.current = [];
              return (
                <GridStyled key={i}>
                  <input
                    type="text"
                    defaultValue={data[0]}
                    ref={(e) => {
                      if (e) editedKey.current.push(e);
                    }}
                  />

                  <input
                    type="text"
                    defaultValue={data[1]}
                    ref={(e) => {
                      if (e) editedVal.current.push(e);
                    }}
                  />

                  <i>
                    <span data-tip="Save">
                      <IconDeviceFloppy onClick={() => updateContent(data[0], i)} />

                      <ReactTooltip place="top" effect="solid" className="info-span" />
                    </span>
                  </i>
                  <i>
                    <span data-tip="Restore content">
                      <IconSquareX onClick={() => restoreContent(data[0], data[1], i)} />{' '}
                      <ReactTooltip place="top" effect="solid" className="info-span" />
                    </span>
                  </i>
                  <i>
                    <span data-tip="Remove entry">
                      <IconTrash onClick={() => deleteEntry(data[0])} />{' '}
                      <ReactTooltip place="top" effect="solid" className="info-span" />
                    </span>
                  </i>
                </GridStyled>
              );
            })}
          </div>
        </>
      )}
    </ListStyled>
  );
}
