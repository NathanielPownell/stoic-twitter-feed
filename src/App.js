import React, { useEffect } from 'react'
import { useInfiniteQuery, QueryClient, QueryClientProvider, useQuery } from "react-query";
import { useInView } from 'react-intersection-observer'
import {
  animated,
} from '@react-spring/web'
import axios from 'axios'
import Quote from './components.js/Quote';
import './App.css'
import { GitHub, Twitter } from '@mui/icons-material';
const queryClient = new QueryClient();


export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Example />
    </QueryClientProvider>
  );
}

function Example() {
  const { ref, inView } = useInView()

  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery(
    "quotes",
    async ({ pageParam = 1 }) => {
      const res = await axios.get('https://stoicquotesapi.com/v1/api/quotes?page=' + pageParam)
      console.log(res.data)
      return res.data
    },
    {
      getPreviousPageParam: firstPage => firstPage.prev_page_url ?? undefined,
      getNextPageParam: lastPage => lastPage.next_page_url ? lastPage.current_page + 1 : undefined,

    }
  );

  React.useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])


  return (
    <div className='app'>
      <div className='nav'>
        <div className='logo'><Twitter fontSize='large' /> Stoic</div>
      </div>
      {status === 'loading' ? (
        <p>Loading...</p>
      ) : status === 'error' ? (
        <span>Error: {error.message}</span>
      ) : (
        <>
          <animated.div className='feed'>
            <div className='description'>
              <h1>Stoic Twitter Feed</h1>
              <p>
                This project uses data from <a href="https://stoicquotesapi.com/" target="_blank">StoicQuotesAPI </a>
                 and loads the data using <a href="https://react-query.tanstack.com/" target="_blank">React Query</a>.
                <br />
                <br />
                As you scroll down you will see new quotes loading from the API.
                <br />
                <br />
              </p>
              <div className='contact'>
                By <a href="https://www.nathanielpownell.com">Nathaniel Pownell</a> &nbsp; <a href="https://github.com/NathanielPownell"><GitHub /></a>
              </div>
            </div>
            <h3>Feed</h3>
            {data.pages.map(page => (
              <React.Fragment key={page.nextId}>
                {page.data.map(quote => (
                  <Quote
                    quote={quote}
                    key={quote.id}
                  >
                  </Quote>
                ))}
              </React.Fragment>
            ))}
            <div className='loaderContainer'>
              <button
                ref={ref}
                onClick={() => fetchNextPage()}
                disabled={!hasNextPage || isFetchingNextPage}
              >
                {isFetchingNextPage
                  ? 'Loading more...'
                  : hasNextPage
                    ? 'Load More'
                    : 'You\'ve reached the end! 🤷‍♂️'}
              </button>
            </div>
          </animated.div>
          <div>
            {isFetching && !isFetchingNextPage
              ? 'Background Updating...'
              : null}
          </div>
        </>
      )}
    </div>
  );
}

