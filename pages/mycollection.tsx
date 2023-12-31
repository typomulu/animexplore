import styles from '../styles/Home.module.css';

import { useState, useEffect } from 'react';

import { gql } from '@apollo/client';
import client from './api/anilist-client';

import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';

/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"

import AnimeBox from '../components/animeBox'
import DynaHead from '../components/head';

const GET_ANIMES_QUERY = gql`
  query GetAnimes($id: Int, $page: Int, $perPage: Int, $search: String) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
      media(id: $id, search: $search) {
        id
        bannerImage
        title {
          romaji
          english
          native
        }
      }
    }
  }
`;

export default function Home({ animes, pageInfo }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [animeData, setAnimeData] = useState(animes);

  useEffect(() => {
    fetchAnimeData(1);
  }, []);

  useEffect(() => {
    fetchAnimeData(currentPage);
  }, [currentPage]);

  const onChange: PaginationProps['onChange'] = async (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchAnimeData = async (page) => {
    try {
      const { data } = await client.query({
        query: GET_ANIMES_QUERY,
        variables: {
          page: page,
          perPage: 10,
        },
      });

      setAnimeData(data.Page.media);
    } catch (error) {
      console.error('Error fetching anime data:', error);
      setAnimeData([]);
    }
  };

  return (
    <div className={styles.container}>
      <DynaHead title={"AnimExplore - MyCollection"} />

      <div style={{ display: "flex", justifyContent: "center", minHeight: "55vh" }}>
        ON PROGRESS
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const { data } = await client.query({
      query: GET_ANIMES_QUERY,
      variables: {
        page: 1,
        perPage: 10,
      },
    });

    return {
      props: {
        animes: data.Page.media,
        pageInfo: data.Page.pageInfo,
      },
    };
  } catch (error) {
    console.error('Error fetching initial anime data:', error);
    return {
      props: {
        animes: [],
        pageInfo: { total: 0, currentPage: 0, lastPage: 0, hasNextPage: false, perPage: 0 },
      },
    };
  }
}