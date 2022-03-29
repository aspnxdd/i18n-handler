import styled from "styled-components";
import { IconSquareX } from "@tabler/icons";

export const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);

  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index:9;
`;

export const ModalWrapper = styled.div`
  width: 600px;
  height: 600px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: ${(e) => e.theme.body};
  color: ${(e) => e.theme.fontColor};

  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 99;
  border-radius: 10px;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: ${(e) => e.theme.fontColor};
  p {
    margin-bottom: 1rem;
  }
  & > button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
  }
`;

export const CloseModalButton = styled(IconSquareX)`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
  transition: all 200ms ease-in-out;
  &:hover {
    color: #da5084;
  }
`;

export const FormStyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left:4rem;
  input {
    border-radius: 90px;
    border-width: 1px;
    border-color: black;
    padding: 0.3rem;
  }
  div {
    display:flex;
    justify-content: center;
    align-items: center;
  }
  button {
    border-width: 0px;
    margin-top: 0rem;
    border-radius: 150px;
    height:2rem;
    color:#fff;
    width:7rem;
    background-color: #8f8f8f;
    transition: all 200ms ease-in-out;
    &:hover {
      background-color: #818181;
    }
  }
`;