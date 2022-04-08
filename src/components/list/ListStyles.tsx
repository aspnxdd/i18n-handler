import styled from "styled-components";

export const Title = styled.span`
  display:flex;
  justify-items: center;
  gap:2rem;
  align-items: center;
  & > i {
    margin-left:1rem;
    margin-top:3px;
    cursor:pointer;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    border-radius: 999px;
    
    &:hover {
      color: #6BF1C4;
    }
  }
`;

export const ListStyled = styled.div`
  margin-left: 4rem;
  h1 {
    text-align: center;
    font-size: 1.8rem;
  }
  display: flex;
  align-items: center;
  justifiy-content: center;
  flex-direction: column;
  height: 100%;
  .listContent {
    overflow: scroll;
    padding-right: 1rem;
  }
`;

export const GridStyled = styled.div`
  display: grid;
  margin-bottom: 0.5rem;
  grid-template-columns: 10rem 10rem 2rem 2rem 2rem 1rem;
  grid-gap: 1rem;
  justify-items: center;
  align-items: center;
  background-color: #191645;
  border: 3px #5650B1 solid;
  color:#fff;
  border-radius: 1rem;
  & > input {
    max-width: 10rem;
    overflow: hidden;
    color:#fff;
    background-color: inherit;
    text-overflow: ellipsis;
    white-space: nowrap;
    outline: none;
    border:0;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    margin-left:2rem;
    &:first-child {
      padding-left: 1rem;

    }
    . &:focus {
      max-width: 10rem;
      overflow: hidden;
      text-overflow: unset;
      white-space: initial;
      height: auto;
    }
  }
  & > i {
    align-items: center;
    justify-content: center;
    font-style: normal;
    display: flex;
    align-content: center;
    cursor: pointer;
    margin-left: auto;
    margin-right: auto;
    border-radius: 999px;
    padding: 0.3rem;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
    &:hover {
      color: ${(e) => e.theme.focusColor};
    }
  }
`;

export const GridStyledHeader = styled.div`
  margin-right: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  display: grid;
  grid-template-columns: 10rem 10rem 2rem 2rem 2rem 1rem;
  grid-gap: 1rem;
  color:#fff;

  justify-items: center;
  align-items: center;
  border-radius: 12rem;
  height:2.5rem;
  border: 3px #5650B1 solid;
  font-weight: bold;
  background-color: rgba(130,71,229);
  background-color: #191645;
  & > span {
    padding: 0.3rem;
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;
