// import React from 'react';
// import { Controller } from 'react-hook-form';
// import {
//   FormSelect,
//   FormField,
//   StyledForm,
//   FormDropdown,
// } from '../Styled/Styled';
// import { DateRangePicker } from 'rsuite';
// import { BsCalendar2MonthFill } from 'react-icons/bs';
// import docIcon from '../../assets/icon/doc.png';

// const WorkExperience = ({
//   workFields,
//   appendWork,
//   removeWork,
//   register,
//   errors,
//   formCities,
//   control,
// }) => {
//   return (
//     <div className="advanced-item w-[635px] text-nowrap">
//       <FormDropdown>
//         <div className="flex gap-4">
//           <img className="size-6" src={docIcon} alt="" />
//           <p>Опыт работы</p>
//         </div>
//         <p className="cursor-pointer" onClick={() => appendWork({})}>
//           +Добавить
//         </p>
//       </FormDropdown>
//       {workFields.map((item, index) => (
//         <div key={item.id} className="advanced-open">
//           <StyledForm>
//             <div className="info-item flex flex-col col-span-6">
//               <label className="font-semibold">Навыки/знания</label>
//               <FormField
//                 {...register(`work[${index}].skills`)}
//                 placeholder="Выберите навыки/знания"
//               />
//               {errors.work?.[index]?.skills && (
//                 <div className="text-red-500">
//                   {errors.work[index].skills?.message}
//                 </div>
//               )}
//             </div>

//             <div className="info-item flex flex-col col-span-6">
//               <label className="font-semibold">Компания</label>
//               <FormField
//                 {...register(`work[${index}].company`)}
//                 placeholder="Выберите компанию"
//               />
//             </div>

//             <div className="info-item flex flex-col col-span-6">
//               <label className="font-semibold">Профессия</label>
//               <FormField
//                 {...register(`work[${index}].position`)}
//                 placeholder="Выберите профессию"
//               />
//             </div>

//             <div className="info-item flex flex-col col-span-6">
//               <label className="font-semibold">Город</label>
//               <FormSelect {...register(`work[${index}].city`)}>
//                 <option value="">Укажите город</option>
//                 {formCities.map(city => (
//                   <option key={city} value={city}>
//                     {city}
//                   </option>
//                 ))}
//               </FormSelect>
//             </div>

//             <div className="info-item flex flex-col col-span-12">
//               <label className="font-semibold">Дата начала</label>
//               <Controller
//                 control={control}
//                 name={`work[${index}].dateRange`}
//                 render={({ field }) => (
//                   <DateRangePicker
//                     {...field}
//                     format="MMM yyyy"
//                     caretAs={BsCalendar2MonthFill}
//                   />
//                 )}
//               />
//             </div>

//             <div className="info-item flex flex-col col-span-12">
//               <label className="font-semibold">Достижения</label>
//               <textarea
//                 placeholder="Напишите о своих обязанностях, проделанной работе, результатах."
//                 {...register(`work[${index}].achievements`)}
//                 className="min-h-24 border px-5"
//               ></textarea>
//             </div>

//             <div className="info-item flex flex-col col-span-12">
//               <button
//                 type="button"
//                 onClick={() => removeWork(index)} // This will remove the field at the given index
//                 className="text-red-500"
//               >
//                 Удалить
//               </button>
//             </div>
//           </StyledForm>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default WorkExperience;
