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

export const StyledForm = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 12px;
  padding: 20px;
  font-size: 14px;
  border: 1px solid #a3a3a3;
`;
