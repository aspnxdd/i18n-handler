import React, { useState, useEffect } from "react";
import { projectState, submittingState } from "../states";
import { useRecoilState } from "recoil";
import { Modal } from "../modal/Modal";
import { IconRefresh, IconCirclePlus, IconMoon, IconSun } from "@tabler/icons";
import { IUseState } from "../../interfaces";
import { NavbarStyled, ProjectList } from "./NavbarStyles";

export default function Navbar({
  state: theme,
  setState: setTheme,
}: IUseState<string>) {
  const [projects, setProjects] = useState<Array<string>>(new Array());
  const [, setProject] = useRecoilState(projectState);
  const [sending] = useRecoilState(submittingState);
  const [showModal, setShowModal] = useState(false);

  function getProjects() {
    window.Main.invoke("getProjects").then((arg)=>{
      setProjects(arg);
    });
   

  }

  useEffect(() => {
    getProjects();
  }, []);

  useEffect(() => {
    getProjects();
  }, [sending]);

  const openModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <NavbarStyled>
      <h1>i18n Handler</h1>
      <Modal state={showModal} setState={setShowModal}></Modal>
      <i>
        <IconRefresh onClick={getProjects} />
      </i>
      <ProjectList>
        <h4>
          <b> Projects </b>{" "}
        </h4>
        {projects.map((project, i) => {
          return (
            <button onClick={() => setProject(project)} key={i}>
              <span>{project}</span>
            </button>
          );
        })}
      </ProjectList>
      <i>
        <IconCirclePlus onClick={() => openModal()} />
      </i>
      <i>
        {theme == "light" && <IconMoon onClick={() => setTheme("dark")} />}
        {theme == "dark" && <IconSun onClick={() => setTheme("light")} />}
      </i>
    </NavbarStyled>
  );
}
