--
-- PostgreSQL database dump
--

\restrict SGaFUVDIM9WRrl1ouVmEgLrHLPKxgwgD8C9xVhmTSETYVdahKYM5AB5sbxzINdo

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: derek
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO derek;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: derek
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: game_genres; Type: TABLE; Schema: public; Owner: derek
--

CREATE TABLE public.game_genres (
    game_id integer NOT NULL,
    genre_id integer NOT NULL
);


ALTER TABLE public.game_genres OWNER TO derek;

--
-- Name: games; Type: TABLE; Schema: public; Owner: derek
--

CREATE TABLE public.games (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    image_url text,
    publisher_id integer,
    release_year integer,
    rating numeric(3,1),
    CONSTRAINT games_price_check CHECK ((price >= (0)::numeric)),
    CONSTRAINT games_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (10)::numeric))),
    CONSTRAINT games_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.games OWNER TO derek;

--
-- Name: games_id_seq; Type: SEQUENCE; Schema: public; Owner: derek
--

ALTER TABLE public.games ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: genres; Type: TABLE; Schema: public; Owner: derek
--

CREATE TABLE public.genres (
    genre_id integer NOT NULL,
    genre_name character varying(50) NOT NULL
);


ALTER TABLE public.genres OWNER TO derek;

--
-- Name: genres_genre_id_seq; Type: SEQUENCE; Schema: public; Owner: derek
--

ALTER TABLE public.genres ALTER COLUMN genre_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.genres_genre_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: publishers; Type: TABLE; Schema: public; Owner: derek
--

CREATE TABLE public.publishers (
    publisher_id integer NOT NULL,
    publisher_name character varying(100) NOT NULL
);


ALTER TABLE public.publishers OWNER TO derek;

--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE; Schema: public; Owner: derek
--

ALTER TABLE public.publishers ALTER COLUMN publisher_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.publishers_publisher_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: game_genres; Type: TABLE DATA; Schema: public; Owner: derek
--

COPY public.game_genres (game_id, genre_id) FROM stdin;
10	5
14	2
17	1
17	11
17	7
17	8
5	1
5	3
5	5
15	1
15	6
15	3
3	2
3	5
3	3
4	2
4	5
4	10
25	2
25	1
25	5
26	1
26	3
27	1
27	5
27	9
28	1
28	10
29	9
29	21
29	5
30	32
30	3
31	10
31	1
31	3
32	10
32	1
13	2
13	5
13	3
33	10
33	1
6	8
6	1
6	10
7	1
7	2
34	7
34	1
35	1
35	2
35	5
36	3
36	6
36	32
37	2
37	1
38	1
38	2
38	36
39	2
39	33
39	3
40	1
40	6
40	3
41	1
41	36
41	2
42	37
42	3
42	21
43	1
43	5
43	10
2	3
2	11
2	7
2	36
2	2
2	4
\.


--
-- Data for Name: games; Type: TABLE DATA; Schema: public; Owner: derek
--

COPY public.games (id, title, description, price, stock, image_url, publisher_id, release_year, rating) FROM stdin;
10	Ghost of Tsushima	Samurai open-world adventure	1999.00	8	\N	6	2020	\N
14	Final Fantasy VII Rebirth	Fantasy action RPG	2999.00	4	\N	10	2024	\N
29	Forza Horizon 5	Your ultimate horizon adventure awaits in beautiful Mexico.	59.99	26	https://lutris.net/media/igdb/cover_big/co3ofx.jpg	13	2021	9.6
30	Portal 2	A mind-bending puzzle adventure with dark humor.	19.99	40	https://lutris.net/media/igdb/cover_big/co1rs4.jpg	17	2011	9.9
31	Half-Life 2	Gordon Freeman returns to fight the Combine in City 17.	9.99	50	https://lutris.net/media/igdb/cover_big/co1nmw.jpg	17	2004	9.8
32	Counter-Strike 2	The legendary competitive tactical shooter, rebuilt on Source 2.	0.00	99	https://lutris.net/media/igdb/cover_big/co6ab2.jpg	17	2023	8.7
13	The Elder Scrolls V: Skyrim	Become the Dragonborn and explore the frozen north of Tamriel.	39.99	30	https://lutris.net/media/igdb/cover_big/co1tnw.jpg	9	2011	9.4
33	DOOM Eternal	Rip and tear through the hordes of Hell in this relentless FPS.	39.99	24	https://lutris.net/media/igdb/cover_big/co3p5n.jpg	9	2020	9.0
6	Resident Evil 4	Leon Kennedy faces a terrifying rural conspiracy in this reimagined classic.	59.99	19	https://lutris.net/media/igdb/cover_big/co4tg4.jpg	4	2023	9.3
7	Monster Hunter: World	Hunt colossal monsters in living, breathing ecosystems.	29.99	27	https://lutris.net/media/igdb/cover_big/co1rst.jpg	4	2018	9.0
34	Street Fighter 6	The next generation of the iconic fighting franchise.	59.99	20	https://lutris.net/media/igdb/co5vst.png	4	2023	9.2
35	Assassin's Creed Odyssey	Choose your fate in a Greek epic spanning the Peloponnesian War.	29.99	33	https://lutris.net/media/igdb/cover_big/co2nul.jpg	7	2018	8.7
36	It Takes Two	A co-op-only adventure about a couple turned into dolls by a magic spell.	39.99	23	https://lutris.net/media/igdb/cover_big/co2t97.jpg	28	2021	9.2
37	Final Fantasy VII Remake	Cloud Strife joins the eco-terrorist group AVALANCHE in Midgar.	49.99	17	https://lutris.net/media/igdb/cover_big/co1qxr.jpg	10	2020	9.0
38	Elden Ring: Nightreign	A standalone cooperative survival adventure in the Elden Ring universe.	39.99	20	https://lutris.net/media/igdb/cover_big/co9dz8.jpg	1	2025	8.5
39	Baldur's Gate 3	Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal.	59.99	30	https://lutris.net/media/igdb/cover_big/co2ijb.jpg	31	2023	9.8
2	Dark Souls III	An action RPG set in a dark fantasy world of ruin.	59.99	12	https://lutris.net/media/igdb/cover_big/co1vcf.jpg	1	2016	9.5
17	angry bard	galit na bards	12.34	1	https://imgs.search.brave.com/h3nKAiD9kHZclsEYb5NEJh5xpJSMAFKHj8KLWjOu0no/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/YW5ncnliaXJkcy5j/b20vd3AtY29udGVu/dC91cGxvYWRzLzIw/MjQvMDMvRlJJRU5E/U18yMDIzMDRfMTgy/MXgxMzU1X0tleUFy/dDAyX0NoYXJhY3Rl/cnMtMi04MDB4NTk1/LnBuZw	2	2016	\N
5	The Legend of Zelda: Breath of the Wild	An open-air adventure that redefines exploration in the vast lands of Hyrule.	59.99	25	https://lutris.net/media/igdb/cover_big/co3p2d.jpg	3	2017	9.7
15	Super Mario Odyssey	Join Mario on a massive, globe-trotting 3D adventure.	59.99	32	https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop	3	2017	9.9
3	The Witcher 3: Wild Hunt	A story-driven open world RPG set in a war-torn fantasy universe.	39.99	21	https://lutris.net/media/igdb/cover_big/co1wyy.jpg	2	2015	9.9
4	Cyberpunk 2077	An open-world action RPG set in the dangerous megalopolis of Night City.	39.99	28	https://lutris.net/media/igdb/library_capsule_yfQ7ql1.jpg	2	2020	8.6
25	Elden Ring	A vast world of open fields, dungeons, and formidable foes by FromSoftware.	59.99	16	https://lutris.net/media/igdb/cover_big/co391c.jpg	1	2022	9.6
26	Sekiro: Shadows Die Twice	Carve your own clever path to vengeance in Sengoku-era Japan.	59.99	15	https://lutris.net/media/igdb/cover_big/co2a23.jpg	1	2019	9.4
27	Grand Theft Auto V	Three criminals, one city, and a series of high-stakes heists in Los Santos.	29.99	45	https://lutris.net/media/igdb/cover_big/co2lbd.jpg	8	2013	9.6
28	Halo Infinite	Master Chief returns for a heroic adventure across a vast ringworld.	59.99	22	https://lutris.net/media/igdb/cover_big/co2dto.jpg	13	2021	8.9
40	Hollow Knight	Explore a vast, ruined kingdom of insects and heroes in this hand-drawn action adventure.	14.99	60	https://lutris.net/media/igdb/library_capsule.jpg	32	2017	9.4
41	Hades	Defy the god of the dead as you hack and slash out of the Underworld.	24.99	42	https://lutris.net/media/igdb/cover_big/co39vc.jpg	33	2020	9.5
42	Minecraft	Build, explore and survive in an infinite blocky world.	29.99	80	https://lutris.net/media/igdb/cover_big/co2b4k.jpg	34	2011	9.3
43	Metal Gear Solid V: The Phantom Pain	Snake returns for tactical espionage action in Afghanistan and Africa.	19.99	18	https://lutris.net/media/igdb/cover_big/co1v85.jpg	35	2015	9.1
\.


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: derek
--

COPY public.genres (genre_id, genre_name) FROM stdin;
1	Action
2	RPG
3	Adventure
4	Soulslike
5	Open World
6	Platformer
7	Fighting
8	Horror
9	Racing
10	Shooter
11	Crazy Genre
21	Simulation
32	Puzzle
33	Strategy
35	Sports
36	Roguelike
37	Sandbox
\.


--
-- Data for Name: publishers; Type: TABLE DATA; Schema: public; Owner: derek
--

COPY public.publishers (publisher_id, publisher_name) FROM stdin;
1	FromSoftware
2	CD Projekt Red
3	Nintendo
4	Capcom
5	Bandai Namco
6	Sony Interactive Entertainment
7	Ubisoft
8	Rockstar Games
9	Bethesda Softworks
10	Square Enix
11	Nintendo
12	Sony Interactive Entertainment
13	Microsoft Game Studios
14	CD Projekt Red
15	FromSoftware
16	Rockstar Games
17	Valve
18	Nintendo
19	Sony Interactive Entertainment
20	Microsoft Game Studios
21	CD Projekt Red
22	FromSoftware
23	Rockstar Games
24	Valve
25	Bethesda Softworks
26	Capcom
27	Ubisoft
28	Electronic Arts
29	Square Enix
30	Bandai Namco
31	Larian Studios
32	Team Cherry
33	Supergiant Games
34	Mojang
35	Konami
\.


--
-- Name: games_id_seq; Type: SEQUENCE SET; Schema: public; Owner: derek
--

SELECT pg_catalog.setval('public.games_id_seq', 43, true);


--
-- Name: genres_genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: derek
--

SELECT pg_catalog.setval('public.genres_genre_id_seq', 37, true);


--
-- Name: publishers_publisher_id_seq; Type: SEQUENCE SET; Schema: public; Owner: derek
--

SELECT pg_catalog.setval('public.publishers_publisher_id_seq', 35, true);


--
-- Name: game_genres game_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.game_genres
    ADD CONSTRAINT game_genres_pkey PRIMARY KEY (game_id, genre_id);


--
-- Name: games games_pkey; Type: CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_pkey PRIMARY KEY (id);


--
-- Name: genres genres_genre_name_key; Type: CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_genre_name_key UNIQUE (genre_name);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.genres
    ADD CONSTRAINT genres_pkey PRIMARY KEY (genre_id);


--
-- Name: publishers publishers_pkey; Type: CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.publishers
    ADD CONSTRAINT publishers_pkey PRIMARY KEY (publisher_id);


--
-- Name: game_genres game_genres_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.game_genres
    ADD CONSTRAINT game_genres_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.games(id) ON DELETE CASCADE;


--
-- Name: game_genres game_genres_genre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.game_genres
    ADD CONSTRAINT game_genres_genre_id_fkey FOREIGN KEY (genre_id) REFERENCES public.genres(genre_id) ON DELETE CASCADE;


--
-- Name: games games_publisher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: derek
--

ALTER TABLE ONLY public.games
    ADD CONSTRAINT games_publisher_id_fkey FOREIGN KEY (publisher_id) REFERENCES public.publishers(publisher_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: derek
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict SGaFUVDIM9WRrl1ouVmEgLrHLPKxgwgD8C9xVhmTSETYVdahKYM5AB5sbxzINdo

