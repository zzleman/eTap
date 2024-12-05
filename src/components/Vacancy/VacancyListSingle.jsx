import verifiedIcon from '../../assets/icon/verified.png';
import dislikeIcon from '../../assets/icon/dislike.png';
import shareIcon from '../../assets/icon/share.png';
import starIcon from '../../assets/icon/star.png';
import { useNavigate, useParams } from 'react-router-dom';

const VacancyListSingle = ({
  id,
  salary,
  title,
  companyName,
  location,
  createdAt,
  jobDescription,
}) => {
  const getTimeAgo = timestamp => {
    if (!timestamp) {
      return 'Unknown time';
    }

    const createdAt = timestamp.toDate();
    const now = new Date();
    const diffInSeconds = Math.floor((now - createdAt) / 1000);

    const hours = Math.floor(diffInSeconds / 3600);
    const minutes = Math.floor((diffInSeconds % 3600) / 60);
    const days = Math.floor(diffInSeconds / 86400);

    if (days > 0) {
      return `${days} д назад`;
    } else if (hours > 0) {
      return `${hours} ч назад`;
    } else if (minutes > 0) {
      return `${minutes} мин назад`;
    } else {
      return `Только что`;
    }
  };

  const navigate = useNavigate();
  const { categoryId } = useParams();

  const handleNavigate = id => {
    categoryId
      ? navigate(`/vacancies/${categoryId}/${id}`)
      : navigate(`/vacancies/all/${id}`);
  };
  return (
    <div
      key={id}
      className="vacancy-area flex w-10/12 justify-between border-b border-t py-5"
    >
      <div className="left flex flex-col gap-2 w-40">
        <span className="w-28 h-10 bg-yellow-200 flex justify-center items-center">
          {salary} AZN
        </span>
        <div className="flex gap-3 mb-5 text-green-500">
          <img src={verifiedIcon} alt="" />
          <p>Проверенно</p>
        </div>
        <div className="flex gap-3">
          <img src={dislikeIcon} alt="" />
          <p>Пожаловаться</p>
        </div>
        <div className="flex gap-3">
          <img src={shareIcon} alt="" />
          <p>Поделиться</p>
        </div>
        <div className="flex gap-3">
          <img src={starIcon} alt="" />
          <p>В избранное</p>
        </div>
      </div>
      <div
        className="middle flex flex-col gap-4 w-[385px] cursor-pointer"
        onClick={() => handleNavigate(id)}
      >
        <div className="middle-top flex gap-3">
          <h3 className="font-bold">{title}</h3>
          <p className="bg-red-300 w-24 h-6 flex justify-center items-center ">
            Срочно
          </p>
        </div>
        <div className="middle-center flex gap-3 text-xs">
          <h5 className="font-bold">{companyName}</h5>
          <p className="text-neutral-400">{location}</p>
          <p className="text-neutral-400">{getTimeAgo(createdAt)}</p>
        </div>
        <div
          className="middle-bottom text-sm text-neutral-500 leading-6"
          dangerouslySetInnerHTML={{
            __html: jobDescription.slice(0, 290),
          }}
        />
      </div>
      <div className="right w-20 mr-9">
        <img
          className="h-16 w-36"
          src="https://s3-alpha-sig.figma.com/img/5451/3a81/9f3730deafdbe47ddcf44125352d2255?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=l0Q2ZP2EE8-vMdyw338Gm9r3Xy~VkNvQ--gUVUAp9yAJNg0URognj6pGT1P70ajk6NO8SIqD9h9hKR1KjnBiImDzlWtNzVTzV4q-M1zWn5nhwyrFGsOh13mX1tC9~rUAeGByo7gnkT71HeRnF1HFdF2F5K9PFr3qNCNCrAcxqswcLpjyoMNHFY1Lz7kU6ugrJBmbHPAuf5ymUex3Cr7OBC9HSVS49~Umb3ThEko292inytLjMFHX0Fb62eKBdfSScDUK2thLffdumlts9q3uTceQ2gdta~Y19l4Z7SvnFu4IpEx7eDacfgCKk9wZ4XehOh9vs5daJ963XQ5jwMmK1w__"
          alt=""
        />
      </div>
    </div>
  );
};

export default VacancyListSingle;
