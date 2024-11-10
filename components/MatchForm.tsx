import React from 'react';
import { useForm } from 'react-hook-form';

interface MatchFormProps {
  onSubmit: (data: any) => void;
}

const MatchForm: React.FC<MatchFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm();
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: '20px', alignSelf: 'flex-start', marginLeft: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <label>내전 날짜</label>
        <input type="date" defaultValue={today} {...register('matchDate', { required: true })} style={{ marginLeft: '10px' }} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>내전 시간</label>
        <select {...register('matchTime', { required: true })} style={{ marginLeft: '10px' }}>
          <option value="">시간 선택</option>
          <option value="PM 03:00">오후 3시</option>
          <option value="PM 05:00">오후 5시</option>
          <option value="PM 07:00">오후 7시</option>
          <option value="PM 09:30">오후 9시 30분</option>
          <option value="2차">2차</option>
          <option value="3차">3차</option>
          <option value="4차">4차</option>
        </select>
      </div>
      <button type="submit" style={{ marginTop: '10px' }}>경기 저장</button>
    </form>
  );
};

export default MatchForm;
