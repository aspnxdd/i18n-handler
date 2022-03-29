import React, { useRef, useEffect, useCallback } from "react";

import { Formik, Form, Field } from "formik";

import { submittingState } from "../states";
import { useRecoilState } from "recoil";
import { IUseState } from "../../interfaces";
import {
  Background,
  ModalWrapper,
  ModalContent,
  CloseModalButton,
  FormStyled,
} from "./ModalStyles";

export interface NewProject {
  name: string;
  langs: Array<string>;
  mainLang: string;
}


export const Modal = ({ state:showModal, setState:setShowModal }: IUseState<boolean>) => {
  const [, setSending] = useRecoilState(submittingState);
  const modalRef = useRef(null);
  const initialValues: NewProject = { langs: new Array(), name: "", mainLang: "" };

  const closeModal = (e: React.MouseEvent ) => {
    if (modalRef.current === e.target) {
      setShowModal(false);
    }
  };

  const keyPress = useCallback(
    (e) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        console.log("I pressed");
      }
    },
    [setShowModal, showModal]
  );

  useEffect(() => {
    document.addEventListener("keydown", keyPress);
    return () => document.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  return (
    <>
      {showModal ? (
        <Background onClick={closeModal} ref={modalRef}>
          <div>
            <ModalWrapper>
              <ModalContent>
                <h1>New project</h1>
                <Formik
                  initialValues={initialValues}
                  onSubmit={(values, actions) => {
                    if (
                      values.name == "" ||
                      values.langs.length < 2 ||
                      values.mainLang == ""
                    )
                      return alert("Fill the details");
                    setSending(true);
                    window.Main.invoke("newproject", {
                      data: values,
                      
                    }).then(()=>{
                      actions.setSubmitting(false);
                      setSending(false);
                      setShowModal(false);
                    })
                   
                  }}
                >
                  <Form>
                    <FormStyled>
                      <label htmlFor="name">Name</label>
                      <Field id="name" name="name" placeholder="Name..." />
                      <p>Languages</p>
                      <label>
                        <Field type="radio" name="mainLang" value="spanish" />
                        <Field type="checkbox" name="langs" value="spanish" />
                        Spanish
                      </label>
                      <label>
                        <Field type="radio" name="mainLang" value="english" />
                        <Field type="checkbox" name="langs" value="english" />
                        English
                      </label>
                      <label>
                        <Field type="radio" name="mainLang" value="german" />
                        <Field type="checkbox" name="langs" value="german" />
                        German
                      </label>
                      <span style={{width:"100%", marginLeft:"1rem"}}> Select at least 2 languages and 1 main language</span>
                      <div>

                      <button type="submit">Submit</button>
                      </div>
                    </FormStyled>
                  </Form>
                </Formik>
              </ModalContent>
              <CloseModalButton
                aria-label="Close modal"
                onClick={() => setShowModal(!showModal)}
              />
            </ModalWrapper>
          </div>
        </Background>
      ) : null}
    </>
  );
};
