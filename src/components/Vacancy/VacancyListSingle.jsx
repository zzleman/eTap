import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarFilledIcon from '@mui/icons-material/Star';
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

const VacancyListSingle = ({
  id,
  salary,
  title,
  companyName,
  companyImg,
  location,
  createdAt,
  jobDescription,
  userFavorites,
  onToggleFavorite,
}) => {
  const [isFavorite, setIsFavorite] = useState(userFavorites.includes(id));
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

  const addToFavorite = async () => {
    setIsFavorite(prev => !prev);

    onToggleFavorite(id, !isFavorite);
  };

  return (
    <div
      key={id}
      className="vacancy-area flex flex-col md:flex-row w-10/12 justify-between border-b border-t py-5"
    >
      <div className="left flex flex-col gap-2 w-40">
        <span className="w-28 h-10 bg-yellow-200 flex justify-center items-center">
          {salary} AZN
        </span>
        <div className="flex gap-3 mb-4 text-green-500">
          <VerifiedUserOutlinedIcon style={{ fontSize: 'large' }} />
          <p>Проверенно</p>
        </div>
        <div className="flex md:flex-col gap-4 text-nowrap mb-3 md:mb-0">
          <div className="flex gap-3">
            <ThumbDownOutlinedIcon
              className="text-neutral-400"
              style={{ fontSize: 'large' }}
            />
            <p>Пожаловаться</p>
          </div>
          <div className="flex gap-3">
            <ShareOutlinedIcon
              className="text-neutral-400"
              style={{ fontSize: 'large' }}
            />
            <p>Поделиться</p>
          </div>
          <div className="flex gap-3 cursor-pointer" onClick={addToFavorite}>
            {isFavorite ? (
              <StarFilledIcon
                className="text-yellow-500"
                style={{ fontSize: 'large' }}
              />
            ) : (
              <StarOutlineOutlinedIcon
                className="text-neutral-400"
                style={{ fontSize: 'large' }}
              />
            )}
            <p>{isFavorite ? 'Убрать из избранного' : 'В избранное'}</p>
          </div>
        </div>
      </div>
      <div
        className="middle flex flex-col gap-4 w-[385px] cursor-pointer"
        onClick={() => handleNavigate(id)}
      >
        <div className="middle-top flex gap-3">
          <h3 className="font-bold text-base md:text-nowrap">{title}</h3>
          <p className="bg-red-300 w-24 h-6 flex justify-center items-center ">
            Срочно
          </p>
        </div>
        <div className="middle-center flex gap-3 text-xs items-center">
          <p className="font-bold">{companyName}</p>
          <div className="flex items-center">
            <p className="text-neutral-400">{location}</p>
          </div>
          <div>
            <p className="text-neutral-400">{getTimeAgo(createdAt)}</p>
          </div>
        </div>
        <div
          className="middle-bottom text-sm text-neutral-500 leading-6"
          dangerouslySetInnerHTML={{
            __html: jobDescription.slice(0, 290),
          }}
        />
      </div>
      <div className="right w-20 mr-9">
        <img className="h-16 w-36" src={companyImg} alt="" />
      </div>
    </div>
  );
};

export default VacancyListSingle;
