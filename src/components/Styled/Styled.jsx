import styled from 'styled-components';

export const FormField = styled.input`
  border: 1px solid #a3a3a3;
  height: 40px;
  border-radius: 5px;
  padding: 0 20px;
  outline: none;
`;

export const FormSelect = styled.select`
  border: 1px solid #a3a3a3;
  height: 40px;
  border-radius: 5px;
  padding: 0 20px;
  outline: none;
  grid-column: span 4;
`;

export const FormDropdown = styled.div`
  background-color: #563d7c;
  color: white;
  display: flex;
  justify-content: space-between;
  height: 80px;
  align-items: center;
  padding: 0 28px;
`;
