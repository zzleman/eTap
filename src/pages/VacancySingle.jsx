import React from 'react';
import col from '../assets/icon/col.png';
import row from '../assets/icon/row.png';
import verifiedIcon from '../assets/icon/verified.png';
import dislikeIcon from '../assets/icon/dislike.png';
import shareIcon from '../assets/icon/share.png';
import starIcon from '../assets/icon/star.png';
import { useParams } from 'react-router-dom';

const VacancySingle = () => {
  const { id } = useParams();
  return (
    <div className="px-36">
      <div className="job py-10">
        <div className="main flex justify-between mb-7">
          <h1 className="text-3xl font-bold">Qrafik Dizayner</h1>
          <div className="flex">
            <img className="size-6" src={col} alt="" />
            <img className="size-6" src={row} alt="" />
          </div>
        </div>
        <div className="top flex gap-16">
          <div className="left w-9/12 text-neutral-500 text-sm">
            <div className="general-info">
              <p className="w-[104px] h-10 bg-yellow-200 flex justify-center items-center text-black font-bold">
                300 AZN
              </p>
              <div className="place-time text-xs py-7 flex flex-col gap-3">
                <h5>Азербайджан., Баку</h5>
                <p>Обновлено 21.08.2018</p>
              </div>
            </div>
            <div className="details w-96 flex flex-col gap-3 mb-7">
              <h4 className="flex ">
                <span className="text-black font-bold w-2/4">
                  График работы:
                </span>
                <span>Свободный</span>
              </h4>
              <h4 className="flex">
                <span className="text-black font-bold  w-2/4">Опыт: </span>
                <span>3 года</span>
              </h4>
              <h4 className="flex">
                <span className="text-black font-bold  w-2/4">
                  Образование:
                </span>
                <span>Неполное среднее</span>
              </h4>
              <h4 className="flex">
                <span className="text-black font-bold  w-2/4">Занятость: </span>
                <span>Работа вахтовым методом</span>
              </h4>
            </div>
            <div className="job-requirements flex flex-col gap-6">
              <h2 className="font-bold text-black">
                Должностные объязанности:
              </h2>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Possimus minus voluptatum dolorem libero aliquam doloribus
                exercitationem rem consequuntur harum quisquam assumenda sit
                sint sed nemo voluptas quos vitae architecto reiciendis, labore
                autem qui, ipsum totam iste modi. Architecto voluptates quasi,
                saepe, illo possimus officiis velit ullam explicabo harum eum
                officia distinctio quae deleniti praesentium a non laudantium
                tenetur asperiores laborum, accusantium necessitatibus est
                repellat assumenda esse? Pariatur ratione, ipsa nostrum natus
                hic ullam, dolores maiores alias nobis, itaque corporis dolor
                quo velit. Soluta quis sunt aliquam voluptate nesciunt aperiam
                quam vitae quasi totam voluptatem modi, fugit accusamus
                architecto asperiores nostrum inventore eaque, hic quae
                exercitationem atque iste eveniet quia ea. Cupiditate dolores
                dolorem vel exercitationem sapiente amet optio velit fuga
                maiores omnis beatae officiis atque eum voluptates animi saepe
                iusto dolorum, magnam autem accusamus fugiat error aliquam non.
                Veritatis reiciendis quasi voluptas unde animi ab voluptatum
                cumque laboriosam voluptatibus porro.
              </p>
            </div>
            <div className="company-desc flex flex-col gap-6 my-6">
              <h3 className="font-bold text-black">About Company:</h3>
              <p>
                Lorem Ipsum является текст-заполнитель обычно используется в
                графических, печать и издательской индустрии для
                предварительного просмотра макета и визуальных макетах.Lorem
                Ipsum является текст-заполнитель обычно используется в
                графических, печать и издательской индустрии для
                предварительного просмотра макета и визуальных макетах.
              </p>
            </div>
          </div>
          <div className="right border border-b-0 h-96 p-8 text-xs text-neutral-500 w-[485px]">
            <h1 className=" uppercase font-bold text-base">Компания</h1>
            <div className="middle flex gap-8 items-center my-7">
              <img
                className="h-14 w-14"
                src="https://s3-alpha-sig.figma.com/img/425c/5534/b575d3032af63e3be8fd66452e7f59d0?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SO9rZ~Dukphub9Gl3I~1FhOeg~mJDnTtYwKW-HrJJbOSBjqaKIcE0YIs-HOrlNu0cS1JwSz9gLLzwm-GV2KUhruPa4MzV3eBrRmdTIyn4qSjKSGpTOkPzOXgDuBykJxV-nkiKSpHlPwdsx3ERoED64TZevCtaAznbHiJ1beubt-U~azg7tRHyJVFPWkz01Fm9~lN4dV1jumBKfpbFYIohmiLUoc6mLpbmjFvEbuNEU2T8-z0HdLwOu9gUevu8qmP5rrjchm-TdvRKnN3NjvmG0dXzCQ6nesVIV9gsNDOBcqKwDsK7ElMDJ1jET5Mx21-fPniRMfMFngjfRS5CcZLng__"
                alt=""
              />
              <div>
                <h5 className="font-bold pl-1 text-black">Baku Electronics</h5>
                <div className="flex items-center gap-3">
                  <img className="w-6 h-6" src={verifiedIcon} alt="" />
                  <p className="text-green-600">Проверенно</p>
                </div>
              </div>
            </div>
            <div className="bottom flex flex-col gap-5">
              <h3 className=" uppercase font-bold text-base">Contact</h3>
              <p>
                Войдите в личный кабинет или зарегистрируйтесь для просмотрп
                котактов работадателя.
              </p>
              <button className="text-green-500 border border-green-500 h-10 w-[88px]">
                Войти
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="utils flex justify-center gap-14 text-xs text-neutral-500 mb-7">
        <div className="flex gap-3 items-center">
          <img src={starIcon} alt="" />
          <p>В избранное</p>
        </div>
        <div className="flex gap-3 items-center">
          <img src={dislikeIcon} alt="" />
          <p>Пожаловаться</p>
        </div>
        <div className="flex gap-3 items-center">
          <img src={shareIcon} alt="" />
          <p>Поделиться</p>
        </div>
      </div>
    </div>
  );
};

export default VacancySingle;
