import styled from "styled-components";

export const NavbarStyled = styled.div`
  h1 {
    text-align: center;
    font-size: 1.8rem;
  }

  background-color: #7c7c7c;

  /* position:fixed;   */
  height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;

  

  & > i {
    margin-top: 2rem;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
    display: flex;
    align-content: center;
    cursor: pointer;
    margin-left: auto;
    margin-right: auto;
    border-radius: 999px;
    padding: 0.3rem;
    svg {
      transition: all 0.3s ease;
      color: ${(e) => e.theme.fontColor};
    }
    &:hover {
      svg {
        transition: all 0.3s ease;
        color: ${(e) => e.theme.body};
      }
    }
  }
`;

export const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  max-height: 10rem;
  background-color: #575757;
  padding-top: 1rem;
  padding-bottom: 1rem;

  & > button {
    color: black;
    cursor: pointer;
    text-align: left;
    width: 100%;
    background-color: #575757;
    border-color: #575757;
    border-width: 0px;
    outline: none;
    &:hover {
      background-color: white;
    }
    &:focus {
      background-color: #d4d4d4;
    }

    span {
      margin-left: 1rem;
    }
  }

  h4 {
    margin: 0;
    margin-left: 1rem;
    margin-bottom: 1rem;
    color: white;
  }
  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #575757;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #aaaaaa;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #aaaaaa;
  }
`;
