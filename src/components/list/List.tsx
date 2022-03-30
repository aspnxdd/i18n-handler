import React, { useEffect, useState, useRef } from 'react';
import { ListStyled, GridStyled, GridStyledHeader, Title } from './ListStyles';
import FormComp from '../form/Form';
import { IconDeviceFloppy, IconSquareX, IconTrash, IconFileExport } from '@tabler/icons';
import { projectState, submittingState } from '../states';
import { useRecoilState } from 'recoil';
import ReactTooltip from 'react-tooltip';

export default function List() {
  const [project] = useRecoilState(projectState);
  const [sending, setSending] = useRecoilState(submittingState);
  const [projectData, setProjectData] = useState<Array<string[]>>([]);
  const [langs, setLangs] = useState<string[]>([]);
  const [lang, setLang] = useState<string | null>(null);

  const editedKey = useRef(new Array());
  const editedVal = useRef(new Array());

  const updateContent = (prevKey: string, i: number) => {
    setSending(true);
    window.Main.invoke('updateContent', {
      key: editedKey.current[i].textContent,
      val: editedVal.current[i].textContent,
      id: project,
      prevKey: prevKey
    }).then(() => setSending(false));
  };

  const restoreContent = (prevKey: string, prevVal: string, i: number) => {
    editedKey.current[i].textContent = prevKey;
    editedVal.current[i].textContent = prevVal;
  };

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

  const deleteEntry = (key: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    setSending(true);
    window.Main.invoke('deleteEntry', { key: key, id: project }).then(() => setSending(false));
  };

  useEffect(() => {
    if (lang)
      window.Main.invoke('getOneProject', project, lang).then((arg: { string: string }) => {
        setProjectData([...Object.entries(arg)]);
      });
  }, [lang]);

  useEffect(() => {
    if (project) {
      window.Main.invoke('getOneProject', project, lang).then((arg: { string: string }) => {
        setProjectData([...Object.entries(arg)]);
      });
      window.Main.invoke('getLangs', project).then((arg) => {
        setLangs(arg);
      });
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
            <span>Val</span>
            <span></span>
            <span></span>
            <span></span>
          </GridStyledHeader>
          <div className="listContent">
            {projectData.map((data, i) => {
              return (
                <GridStyled key={i}>
                  <span ref={(e) => editedKey.current.push(e)} contentEditable>
                    {data[0]}
                  </span>{' '}
                  <span ref={(e) => editedVal.current.push(e)} contentEditable>
                    {data[1]}
                  </span>
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
