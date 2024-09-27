import { Suspense } from 'react';
import SearchResults from './SearchResults';

export default function SearchPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
