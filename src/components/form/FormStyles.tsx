import styled from "styled-components";

export const FormStyled = styled.div`
  & > span {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    width: fit-content;
    text-decoration: underline dotted gray;
  }
`;

export const SpanStyled = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;


  & label {
    margin-top:1rem;
  }

  & span {
    display: flex;
    flex-direction: column;
    &:nth-child(2) {
      margin-left: 1rem;
    }
    align-items: center;
    justify-content: center;
  }
  & div {
    display: flex;
    flex-direction: row;
    column-gap: 4rem;
  }

  & input {
   
    border-radius: 12rem;
    outline: none;
    border: 1px solid gray;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
  }

  & button {
    margin-top: 1rem;
    width: auto;
    border-radius: 12rem;
    background-color: #465e88;
    border: 0px;
    color: ${(e) => e.theme.fontColor};
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    width: 10rem;
    transition: all 0.15s ease-in-out;
    &:hover {
      transform: scale(1.1);
      background-color: #7e94bc;
    }
  }
`;
