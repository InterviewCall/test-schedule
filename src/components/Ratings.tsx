import { Star } from 'lucide-react';
import { FC } from 'react';

interface Props {
    rating: number
}

const Ratings: FC<Props> = ({ rating }) => {
    return (
        <div className='flex justify-center items-center'>
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={15}
              fill={star <= rating ? 'gold' : 'none'}
              stroke={star <= rating ? 'gold' : 'currentColor'}
            />
          ))}
        </div>
    );
};

export default Ratings;