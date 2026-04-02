# React App Assignment

###### Full Stack Development 2, HDip in Computer Science

__Name:__ Andrian Barbulat

__Vercel:__ https://movie-base-fullstack.vercel.app/ 

This repository contains an implementation of the Movie Fans Web Application using the React library. 

### Features

+ Multiple views - 14+ views
+ Listing the views of Most popular movies, Actors, TV Series, Genres.
+ Detail view for Actor, TV Series, Company, Country
+ Extensive Data Hyperlinking present across pages (example: Movie details page)
+ Server state Caching
+ Actor page
+ TV series page
+ Multiple options for filtering and/or sorting criteria.
+ Pagination - for data-listing pages.
+ Private and Public routes (e.g. Movie Details).
+ Multi-criteria Search.
+ Favourite Movie.
+ Ordered Favourites.
+ Advanced Fantasy movie
+ 3rd Party/custom Authentication - Supabase/Custom API.
+ Deployment Vercel (in process of completion, a few errors are unable to be fixed appeared at the end of the projet)
+ Allowing the addition of a cast, where each member has a role name and description. Adding/Uploading a movie poster.
+ Backend persistence using Supabse -  Favourites, Fantasy movie.

### Project Highlights

<p align="center">
  <img src="ProjectHighlighImages/01.png" width="600" />
</p>
<p align="center">
  <img src="ProjectHighlighImages/02.png" width="600" />
</p>
<p align="center">
  <img src="ProjectHighlighImages/03.png" width="600" />
</p>

### Setup requirements.

In order to run the project, it will require:

1. Run the NPM install command
2. Add the supabase api password and URL in file supbase.ts
3. Add the TMDb api  key in env (variable VITE_TMDB_KEY=)
4. Create the tables in supabase using the commands

CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL DEFAULT uuid_generate_v4(),
    movie_id INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image_url TEXT,
    rating NUMERIC,
    title TEXT,
    overview TEXT,
    popularity NUMERIC,
    release_date DATE,
    vote_count INT
);

CREATE TABLE myfantasymovie (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    overview TEXT,
    genre TEXT,
    runtime INTEGER,
    director TEXT,
    budget NUMERIC,
    poster TEXT,
    cast JSONB
);

Create a bucket called posters


### API endpoints

1. getMovie
   - Retrieves detailed information about a specific movie by its ID.
   - Endpoint: `/movie/{id}`

2. getGenres
   - Fetches a list of all movie genres available
   - Endpoint: `/genre/movie/list`

3. getUpcomingMovies
   - Lists movies that are scheduled to be released soon,.
   - Endpoint: `/movie/upcoming`

4. fetchGenres
   - Same as `getGenres` but implemented asynchronously to handle real-time user interactions more effectively.
   - Endpoint: `/genre/movie/list`

5. fetchGenreMovies
   - Purpose: Retrieves movies that fall under a specific genre.
   - Endpoint: `/discover/movie` with a `with_genres` parameter.

6. fetchPopularMovies
   - Purpose: Lists currently popular movies, ideal for a "Popular Movies".
   - Endpoint: `/movie/popular`

7. fetchPopularActors
    - Purpose: Provides a list of currently popular actors.
    - Endpoint: `/person/popular`

8. fetchActorDetails
    - Offers detailed information about a specific actor, enhancing actor profiles on the app.
    - Endpoint: `/person/{actorId}`

9. fetchActorMovies
    - Lists all movies associated with a given actor.
    - Endpoint: `/person/{actorId}/movie_credits`

10. fetchTVSeries
    - Retrieves popular TV series, which could be part of a section dedicated to television content.
    - Endpoint: `/tv/popular`

11. getMovieCredits
    - Fetches the cast and crew for a specific movie, essential for detailed credits on movie pages.
    - Endpoint: `/movie/{id}/credits`

12. fetchCompanyDetails
    - Provides details about a company, useful for showing information about the company producing or distributing a movie.
    - Endpoint: `/company/{companyId}`

13. getMoviesByCountry
    - Filters movies by their country of origin, helping categorize movies based on the country for targeted content.
    - Endpoint: `/discover/movie` with `with_origin_country` parameter.

14. fetchSeriesDetails
    - Fetches detailed information about a specific TV series, enhancing the depth of content on TV series pages.
    - Endpoint: `/tv/{id}`

15. searchMovies
    - llows users to search for movies based on a query and various filters like year and region, improving the app's interactivity and user-directed navigation.
    - Endpoint: `/search/movie`


### Routing

[ List the __new routes__ supported by your app and state the associated page.]

+ /signin - Provides a sign-in page for user authentication. (public)
+ /signup - Offers a sign-up page for new user registration. (public)
+ /movies/upcoming - Shows a list of upcoming movies. (public)
+ /genres - Displays different movie genres available. (public)
+ /popular - Lists popular movies. (public)
+ /actors - Showcases a list of actors. (public)
+ /tvseries - Displays TV series available on the platform. (public)
+ /create-movie - Allows logged-in users to create entries for fantasy movies (require authentication).
+ /actors/:id - Displays detailed information about a specific actor (require authentication).
+ /series/:id - Shows details about a specific TV series (require authentication).
+ /genres/:genreId - Displays movies under a specific genre (require authentication).
+ /movies/:id - Displays detailed information about a specific movie (Protected Route).
+ /reviews/:id - Shows all reviews for a specific movie (require authentication).
+ /search - Provides a search interface for finding movies, actors, or TV series (require authentication).
+ /favorites - Lists all movies marked as favorites by the logged-in user (require authentication).
+ /companies/:companyId - Displays detailed information about a specific production company (require authentication).
+ /countries/:countryCode - Shows movies produced in a specific country (require authentication).

### Third Party Components/Integration

[Describe the level of  integration/use or other API's or third party components]

+ TMDb 

### Independent learning (If relevant)

Certainly! Here's a list of technologies and techniques you may have researched independently for your project, along with the file names where these are implemented and references to helpful resources:

Resources which served as a guidance in some cases where a problem/error was encountered. 

1. Context API for State Management
   - Implemented in: src/components/authenthication/index.tsx
   - https://reactjs.org/docs/context.html

2. React Router for Client-Side Routing
   - Implemented in the whole project
   - https://reactrouter.com/web/guides/quick-start

3. Material-UI for Component Styling
   - Implemented in: src/components/Footer/footer.tsx
   - https://material-ui.com/getting-started/installation/

4. Protected Routes in React Router
   - Implemented in: src/components/authenthication/ProtectedRoute.js
   - https://ui.dev/react-router-protected-routes-authentication/

5. Supabase for Backend Services
   - Implemented in: src/components/authenthication/index.tsx
   - https://supabase.com/docs/guides/with-react

6. Image Upload and Management with Supabase
   - Implemented in: src/pages/myFantasyMovie.tsx
   - Reference: https://supabase.com/docs/guides/storage

7. Error Handling in Async/Await Functions
    - Implemented in: src/api/tmdb-api.ts
    - Reference: https://javascript.info/async-await#error-handling

8. Environment Variables in React
    - Implemented in: src/api/tmdb-api.ts
    - Reference: https://create-react-app.dev/docs/adding-custom-environment-variables/

9. Lazy Loading of Components
    - https://reactjs.org/docs/code-splitting.html#reactlazy

10. Advanced Routing Techniques with Query Parameters
    - https://reactrouter.com/web/example/query-parameters


These resources can provide deeper insights into the mentioned technologies and techniques, allowing for a richer understanding and application in your project.