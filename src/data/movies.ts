import { Movie, MovieGenre } from '../types';

export const MOVIES: Movie[] = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    formatBadge: 'IMAX 70MM',
    releaseDate: 'Mar 1, 2024',
    ageRating: 'PG-13',
    cinematography: 'Greig Fraser, ASC',
    sound: 'Hans Zimmer',
    studio: 'Legendary / Warner Bros.',
    overview:
      'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a terrible future only he can foresee.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg',
    rating: 8.6,
    releaseYear: 2024,
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    durationMinutes: 166,
    director: 'Denis Villeneuve',
    cast: [
      {
        name: 'Timothée Chalamet',
        character: 'Paul Atreides',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg',
      },
      {
        name: 'Zendaya',
        character: 'Chani',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/r3A7ev7QkjvEgQxvrpXx1bEs8Wz.jpg',
      },
      {
        name: 'Rebecca Ferguson',
        character: 'Lady Jessica',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/6NRn2LUP506Bgh5264bV1Jv2Pz2.jpg',
      },
      {
        name: 'Javier Bardem',
        character: 'Stilgar',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/pLLqPqCqB8CjH20K0kH6o0d2f1K.jpg',
      },
    ],
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    formatBadge: '70MM Ultra',
    releaseDate: 'Jul 21, 2023',
    ageRating: 'R',
    cinematography: 'Hoyte van Hoytema, ASC',
    sound: 'Ludwig Göransson',
    studio: 'Syncopy / Universal',
    overview:
      'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the deep moral dilemma and geopolitical upheaval of the Manhattan Project.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg',
    rating: 8.9,
    releaseYear: 2023,
    genres: ['Drama', 'Thriller'],
    durationMinutes: 180,
    director: 'Christopher Nolan',
    cast: [
      {
        name: 'Cillian Murphy',
        character: 'J. Robert Oppenheimer',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/dm6VvCqEsl1G4qM8L5j60V3K2R.jpg',
      },
      {
        name: 'Emily Blunt',
        character: 'Katherine Oppenheimer',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/nPJXaRMVUvgmn2z835bkm1X8Z0a.jpg',
      },
      {
        name: 'Matt Damon',
        character: 'Leslie Groves',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/elSlNg0WiqyG12Z5z6K5jR5c.jpg',
      },
      {
        name: 'Robert Downey Jr.',
        character: 'Lewis Strauss',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/5qHNjhtjMD4YWH3ag0SCvck89eo.jpg',
      },
    ],
  },
  {
    id: 'spider-verse-2',
    title: 'Spider-Man: Across the Spider-Verse',
    tagline: 'It’s how you wear the mask that matters.',
    formatBadge: 'Dolby Atmos',
    releaseDate: 'Jun 2, 2023',
    ageRating: 'PG',
    cinematography: 'Visual Development Collective',
    sound: 'Daniel Pemberton',
    studio: 'Sony Pictures Animation',
    overview:
      'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    rating: 8.8,
    releaseYear: 2023,
    genres: ['Animation', 'Action', 'Sci-Fi'],
    durationMinutes: 140,
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: [
      {
        name: 'Shameik Moore',
        character: 'Miles Morales',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/u7K28C3K4Rj0c3453b3k4k5j6.jpg',
      },
      {
        name: 'Hailee Steinfeld',
        character: 'Gwen Stacy',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/6K7v3K234k2l3k45l6k7j8.jpg',
      },
      {
        name: 'Oscar Isaac',
        character: 'Miguel O’Hara',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/8k7v3K234k2l3k45l6k7j8.jpg',
      },
    ],
  },
  {
    id: 'the-dark-knight',
    title: 'The Dark Knight',
    tagline: 'Welcome to a world without rules.',
    formatBadge: 'IMAX 70MM',
    releaseDate: 'Jul 18, 2008',
    ageRating: 'PG-13',
    cinematography: 'Wally Pfister, ASC',
    sound: 'Hans Zimmer',
    studio: 'Warner Bros. Pictures',
    overview:
      'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets, but soon finds himself prey to a reign of chaos unleashed by the Joker.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/dqK9Hag1054tghRQSqLSfrkvQnA.jpg',
    rating: 9.0,
    releaseYear: 2008,
    genres: ['Action', 'Crime', 'Drama'],
    durationMinutes: 152,
    director: 'Christopher Nolan',
    cast: [
      {
        name: 'Christian Bale',
        character: 'Bruce Wayne / Batman',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/b7fTC9WFkgqGOv77mLQ0VdkCWid.jpg',
      },
      {
        name: 'Heath Ledger',
        character: 'Joker',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/5Y9HnYYa9jF4DdyCUHAXk0xYf.jpg',
      },
      {
        name: 'Aaron Eckhart',
        character: 'Harvey Dent',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/5D2G7Z1Y1Z2Z3Z4Z5Z6.jpg',
      },
    ],
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    formatBadge: '70MM Ultra',
    releaseDate: 'Nov 7, 2014',
    ageRating: 'PG-13',
    cinematography: 'Hoyte van Hoytema, ASC',
    sound: 'Hans Zimmer',
    studio: 'Paramount / Warner Bros.',
    overview:
      'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5VQsXEG.jpg',
    rating: 8.7,
    releaseYear: 2014,
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    durationMinutes: 169,
    director: 'Christopher Nolan',
    cast: [
      {
        name: 'Matthew McConaughey',
        character: 'Cooper',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/sY2mwpafcwqyYS1s5SqTeY6.jpg',
      },
      {
        name: 'Anne Hathaway',
        character: 'Brand',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/tLKit59z0Y2m.jpg',
      },
      {
        name: 'Jessica Chastain',
        character: 'Murph',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/vO1W1W1W1W.jpg',
      },
    ],
  },
  {
    id: 'inception',
    title: 'Inception',
    tagline: 'Your mind is the scene of the crime.',
    formatBadge: 'Dolby Cinema',
    releaseDate: 'Jul 16, 2010',
    ageRating: 'PG-13',
    cinematography: 'Wally Pfister, ASC',
    sound: 'Hans Zimmer',
    studio: 'Warner Bros. Pictures',
    overview:
      'Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    rating: 8.8,
    releaseYear: 2010,
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    durationMinutes: 148,
    director: 'Christopher Nolan',
    cast: [
      {
        name: 'Leonardo DiCaprio',
        character: 'Dom Cobb',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg',
      },
      {
        name: 'Joseph Gordon-Levitt',
        character: 'Arthur',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/4DalZw329y87.jpg',
      },
      {
        name: 'Elliot Page',
        character: 'Ariadne',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/3d038234.jpg',
      },
    ],
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    tagline: 'The key to the future is finally unearthed.',
    formatBadge: 'Dolby Atmos',
    releaseDate: 'Oct 6, 2017',
    ageRating: 'R',
    cinematography: 'Roger Deakins, ASC',
    sound: 'Hans Zimmer, Benjamin Wallfisch',
    studio: 'Alcon / Warner Bros.',
    overview:
      'Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what’s left of society into chaos.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/ilRyASDvt7v5qqbt1kv35764eqh.jpg',
    rating: 8.5,
    releaseYear: 2017,
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    durationMinutes: 164,
    director: 'Denis Villeneuve',
    cast: [
      {
        name: 'Ryan Gosling',
        character: 'Officer K',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/lyUyVARlaPrPVdm.jpg',
      },
      {
        name: 'Harrison Ford',
        character: 'Rick Deckard',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/7CcoVTaOGi.jpg',
      },
      {
        name: 'Ana de Armas',
        character: 'Joi',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/14xtegt.jpg',
      },
    ],
  },
  {
    id: 'the-batman',
    title: 'The Batman',
    tagline: 'Unmask the truth.',
    formatBadge: 'Dolby Vision',
    releaseDate: 'Mar 4, 2022',
    ageRating: 'PG-13',
    cinematography: 'Greig Fraser, ASC',
    sound: 'Michael Giacchino',
    studio: 'DC Films / Warner Bros.',
    overview:
      'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/tRS6jvPM9qPrrnx2KRk3ew96Yot.jpg',
    rating: 8.1,
    releaseYear: 2022,
    genres: ['Crime', 'Action', 'Drama'],
    durationMinutes: 176,
    director: 'Matt Reeves',
    cast: [
      {
        name: 'Robert Pattinson',
        character: 'Bruce Wayne / Batman',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/74xTEgt7.jpg',
      },
      {
        name: 'Zoë Kravitz',
        character: 'Selina Kyle / Catwoman',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/38201.jpg',
      },
    ],
  },
  {
    id: 'parasite',
    title: 'Parasite',
    tagline: 'Act like you own the place.',
    formatBadge: 'Digital 4K',
    releaseDate: 'Nov 8, 2019',
    ageRating: 'R',
    cinematography: 'Hong Kyung-pyo',
    sound: 'Jung Jae-il',
    studio: 'CJ Entertainment',
    overview:
      'All unemployed, Ki-taek’s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/hiKmpnnSantftGFKdEgGd0YvGQO.jpg',
    rating: 8.9,
    releaseYear: 2019,
    genres: ['Thriller', 'Drama', 'Comedy'],
    durationMinutes: 132,
    director: 'Bong Joon-ho',
    cast: [
      {
        name: 'Song Kang-ho',
        character: 'Kim Ki-taek',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/7IiTT.jpg',
      },
    ],
  },
  {
    id: 'eeaao',
    title: 'Everything Everywhere All at Once',
    tagline: 'The universe is so much bigger than you realize.',
    formatBadge: 'Dolby Cinema',
    releaseDate: 'Mar 25, 2022',
    ageRating: 'R',
    cinematography: 'Larkin Seiple',
    sound: 'Son Lux',
    studio: 'A24',
    overview:
      'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save what’s important to her by connecting with the lives she could have led in other universes.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/w3LxiVYPqrlrUImsYmCB1NVVq5W.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/ss0Os3u6utC414xL5ikYR5Z1f8P.jpg',
    rating: 8.3,
    releaseYear: 2022,
    genres: ['Action', 'Adventure', 'Sci-Fi'],
    durationMinutes: 139,
    director: 'Daniel Kwan, Daniel Scheinert',
    cast: [
      {
        name: 'Michelle Yeoh',
        character: 'Evelyn Wang',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/w3Lxi.jpg',
      },
    ],
  },
  {
    id: 'whiplash',
    title: 'Whiplash',
    tagline: 'The road to greatness can take you to the edge.',
    formatBadge: 'Dolby Atmos',
    releaseDate: 'Oct 10, 2014',
    ageRating: 'R',
    cinematography: 'Sharone Meir',
    sound: 'Justin Hurwitz',
    studio: 'Sony Pictures Classics',
    overview:
      'Under the direction of a ruthless instructor, a talented young drummer begins to pursue perfection at any cost, pushing his physical and mental endurance beyond the limit.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/7fn624j5lj3xTme2SgiLCeuedmO.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/6bbZ6XyvgfjhQwbpl3HG3t69IR9.jpg',
    rating: 8.7,
    releaseYear: 2014,
    genres: ['Drama', 'Thriller'],
    durationMinutes: 107,
    director: 'Damien Chazelle',
    cast: [
      {
        name: 'Miles Teller',
        character: 'Andrew Neiman',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/7fn624.jpg',
      },
    ],
  },
  {
    id: 'gladiator',
    title: 'Gladiator',
    tagline: 'What we do in life echoes in eternity.',
    formatBadge: '4K Ultra HD',
    releaseDate: 'May 5, 2000',
    ageRating: 'R',
    cinematography: 'John Mathieson, BSC',
    sound: 'Hans Zimmer, Lisa Gerrard',
    studio: 'DreamWorks / Universal',
    overview:
      'In the year 180, the death of emperor Marcus Aurelius throws the Roman Empire into turmoil. Maximus Decimus Meridius, a loyal general, is betrayed and his family murdered by corrupt prince Commodus.',
    posterUrl: 'https://image.tmdb.org/t/p/w780/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg',
    backdropUrl: 'https://image.tmdb.org/t/p/w1280/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    rating: 8.5,
    releaseYear: 2000,
    genres: ['Action', 'Drama', 'Adventure'],
    durationMinutes: 155,
    director: 'Ridley Scott',
    cast: [
      {
        name: 'Russell Crowe',
        character: 'Maximus Decimus Meridius',
        avatarUrl: 'https://image.tmdb.org/t/p/w185/ty8T.jpg',
      },
    ],
  },
];

export const GENRES: string[] = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Adventure',
  'Thriller',
  'Animation',
  'Crime',
];

export const GENRE_FILTERS: MovieGenre[] = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Adventure',
  'Thriller',
  'Animation',
  'Crime',
];

export function getFeaturedMovie(): Movie {
  return MOVIES[0];
}

export function getSpotlightMovie(): Movie {
  return MOVIES[0];
}

export function getTrendingMovies(): Movie[] {
  return [MOVIES[0], MOVIES[1], MOVIES[2], MOVIES[6], MOVIES[7], MOVIES[9], MOVIES[11]];
}

export function getPopularMovies(): Movie[] {
  return [MOVIES[3], MOVIES[4], MOVIES[5], MOVIES[7], MOVIES[8], MOVIES[10], MOVIES[1]];
}

export function getTopRatedMovies(): Movie[] {
  return [MOVIES[3], MOVIES[1], MOVIES[8], MOVIES[4], MOVIES[10], MOVIES[0], MOVIES[2]];
}

export function getNewReleasesMovies(): Movie[] {
  return [MOVIES[0], MOVIES[1], MOVIES[5], MOVIES[7], MOVIES[11], MOVIES[2]];
}

export function getMovieById(id: string): Movie | undefined {
  return MOVIES.find((m) => m.id === id);
}

export function searchMovies(query: string, genre: string = 'All'): Movie[] {
  const cleanQuery = query.trim().toLowerCase();
  return MOVIES.filter((movie) => {
    const matchesGenre =
      genre === 'All' || movie.genres.some((g) => g.toLowerCase() === genre.toLowerCase());
    const matchesQuery =
      cleanQuery.length === 0 ||
      movie.title.toLowerCase().includes(cleanQuery) ||
      movie.overview.toLowerCase().includes(cleanQuery) ||
      (movie.director && movie.director.toLowerCase().includes(cleanQuery));

    return matchesGenre && matchesQuery;
  });
}
