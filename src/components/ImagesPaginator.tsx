'use client';

import Paginator from './Paginator';
import MediaGallery from '@/app/media-support/_components/MediaGallery';

interface Props {
  images: string[];
  perPage: number;
  basePath?: string;
}

export default function ImagesPaginator({ images, perPage, basePath = '' }: Props) {
  return (
    <Paginator
      items={images}
      perPage={perPage}
      renderItems={(pageImages) => (
        <MediaGallery images={pageImages} basePath={basePath} />
      )}
    />
  );
}
