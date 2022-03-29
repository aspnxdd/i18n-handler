import React, { PropsWithChildren, useEffect, useState, useRef } from "react";
import { ListStyled, GridStyled, GridStyledHeader, Title } from "./ListStyles";
import FormComp from "../form/Form";
import { IconDeviceFloppy, IconSquareX, IconTrash } from "@tabler/icons";
import { projectState, submittingState } from "../states";
import { useRecoilState } from "recoil";

export default function List({ _ }: PropsWithChildren<any>) {
  const [project] = useRecoilState(projectState);
  const [sending, setSending] = useRecoilState(submittingState);
  const [projectData, setProjectData] = useState<any[]>([]);

  const editedKey = useRef(new Array());
  const editedVal = useRef(new Array());

  const updateContent = (prevKey: string, i: number) => {
    setSending(true);
    window.Main.invoke("updateContent", {
      key: editedKey.current[i].textContent,
      val: editedVal.current[i].textContent,
      id: project,
      prevKey: prevKey,
    }).then(()=> setSending(false));
   
  };

  const restoreContent = (prevKey: string, prevVal: string, i: number) => {
    editedKey.current[i].textContent = prevKey;
    editedVal.current[i].textContent = prevVal;
  };

  const deleteProject = () => {
    if (project) {
      if (!window.confirm("Are you sure you want to delete this project?"))
        return;
      setSending(true);

      window.Main.invoke("deleteOneProject", project).then(()=>setSending(false));

    }
  };

  const deleteEntry = (key: string) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    setSending(true);
    window.Main.invoke("deleteEntry", { key: key, id: project }).then(()=>setSending(false));
    
  };

  useEffect(() => {
    if (project) {
      window.Main.invoke("getOneProject", project).then((arg)=> {
        console.log("arg", arg);

        setProjectData([...Object.entries(arg)]);
      });

     
    }
  }, [project, sending]);

  return (
    <ListStyled>
      {!project && <h1 className="title">Select a project</h1>}
      {project && (
        <>
          <Title>
            <h1 className="title">{project}</h1>{" "}<i>   <IconTrash onClick={() => deleteProject()} /> </i> 
          </Title>
          <FormComp project={project} />

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
                  </span>{" "}
                  <span ref={(e) => editedVal.current.push(e)} contentEditable>
                    {data[1]}
                  </span>
                  <i>
                    <IconDeviceFloppy
                      onClick={() => updateContent(data[0], i)}
                    />
                  </i>
                  <i>
                    <IconSquareX
                      onClick={() => restoreContent(data[0], data[1], i)}
                    />{" "}
                  </i>
                  <i>
                    <IconTrash onClick={() => deleteEntry(data[0])} />{" "}
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
