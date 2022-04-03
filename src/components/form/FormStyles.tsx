import styled from "styled-components";
import { Field} from 'formik';

export const FormStyled = styled.div`
  & > span {
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    width: fit-content;
    text-decoration: underline dotted gray;
  }
  & > div {
    padding-top:10rem;
    display: inline-flex;
    width:fit-content;
    margin-left:1rem;
    margin-top:1rem;
    cursor:pointer;
    border: 3px  solid;
    padding:3px;
    border-color:${(e) => e.theme.focusColor};

    padding-left:10px;
    padding-right:10px;
    border-radius:1rem;
    &:hover {
      color:${(e) => e.theme.focusColor};

    }
  }
`;

export const FieldStyled = styled(Field)`
  border: 3px solid;
  border-color:${(e) => e.theme.focusColor};
    border-radius: 12rem;
    outline: none;
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
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


  & button {
    margin-top: 1rem;
    width: auto;
    border-radius: 12rem;
    background-color: ${(e) => e.theme.focusColor};

    border: 3px  solid;
    border-color:${(e) => e.theme.focusColor};
    font-weight:bold;
    color:${(e) => e.theme.fontColor};
    padding: 0.5rem 0.5rem 0.5rem 0.5rem;
    width: 7rem;
    transition: all 0.15s ease-in-out;
    &:hover {
      transform: scale(1.05);
    
    }
  }
`;
