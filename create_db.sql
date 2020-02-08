
DROP TABLE IF EXISTS public.b2c_user_academic;
DROP TABLE IF EXISTS public.b2c_user_award;
DROP TABLE IF EXISTS public.b2c_user_hobby;
DROP TABLE IF EXISTS public.b2c_user_professional;
DROP TABLE IF EXISTS public.b2c_user_project;
DROP TABLE IF EXISTS public.b2c_user_publication;
DROP TABLE IF EXISTS public.b2c_user_research;
DROP TABLE IF EXISTS public.b2c_user_resume;
DROP TABLE IF EXISTS public.b2c_user_skill;
DROP TABLE IF EXISTS public.hobby;
DROP TABLE IF EXISTS public.b2c_user;
DROP TABLE IF EXISTS public.degree;
DROP TABLE IF EXISTS public.stream;
DROP TABLE IF EXISTS public.industry;
DROP TABLE IF EXISTS public.designation;
DROP TABLE IF EXISTS public.skills;

-- Table: public.b2c_user
CREATE TABLE public.b2c_user
(
    id serial NOT NULL,
    first_name character varying COLLATE pg_catalog."default" NOT NULL,
    last_name character varying COLLATE pg_catalog."default" NOT NULL,
    photo_sm text COLLATE pg_catalog."default",
    photo_lg text COLLATE pg_catalog."default",
    dateofbirth timestamp(4) without time zone,
    gender character(1) COLLATE pg_catalog."default",
    maritalstatus character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default",
    alt_email character varying COLLATE pg_catalog."default",
    phone character varying COLLATE pg_catalog."default",
    alt_phone character varying COLLATE pg_catalog."default",
    bloodgroup character varying COLLATE pg_catalog."default",
    aadhar_no character varying COLLATE pg_catalog."default",
    website character varying COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    pin character varying COLLATE pg_catalog."default",
    facebook_link text COLLATE pg_catalog."default",
    linkedin_link text COLLATE pg_catalog."default",
    google_link text COLLATE pg_catalog."default",
    mothertongue text,
    about_me text COLLATE pg_catalog."default",
    resume_heading text COLLATE pg_catalog."default",
    expected_ctc numeric(18,2),
    caste character varying COLLATE pg_catalog."default",
    physical_challenge boolean,
    percentage_ph character varying COLLATE pg_catalog."default",
    passport_no character varying COLLATE pg_catalog."default",
    fathers_name character varying COLLATE pg_catalog."default",
    fathers_occupation character varying COLLATE pg_catalog."default",
    mothers_name character varying COLLATE pg_catalog."default",
    mothers_occupation character varying COLLATE pg_catalog."default",
    created_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    city text,
    CONSTRAINT b2c_user_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user
    OWNER to postgres;
ALTER TABLE b2c_user 
ADD COLUMN isVerified BOOLEAN;
	
	
-- Table: public.degree

-- DROP TABLE public.degree;

CREATE TABLE public.degree
(
    id serial NOT NULL,
    degree_name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    short character varying(100) COLLATE pg_catalog."default",
    branch_id bigint NOT NULL,
    create_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT degree_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.degree
    OWNER to postgres;
COMMENT ON TABLE public.degree
    IS 'Degree of the Candidates ';
	
-- Table: public.stream
CREATE TABLE public.stream
(
    id serial NOT NULL,
    title character varying(240) COLLATE pg_catalog."default" NOT NULL,
    details text COLLATE pg_catalog."default",
    branch_id bigint NOT NULL,
    create_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT stream_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.stream
    OWNER to postgres;
COMMENT ON TABLE public.stream
    IS 'The stream is the department ';

-- Table: public.b2c_user_academic
CREATE TABLE public.b2c_user_academic
(
    id serial NOT NULL,
    user_id bigint,
    board character varying(100) COLLATE pg_catalog."default",
    organization character varying(200) COLLATE pg_catalog."default",
    degree_id bigint,
    stream_id bigint,
    "from" timestamp without time zone,
    "to" timestamp without time zone,
    marks_per character varying(5) COLLATE pg_catalog."default",
    create_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_academic_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_academic_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE,
	CONSTRAINT "b2c_user_academic_&_degree_FK" FOREIGN KEY (degree_id)
        REFERENCES public.degree (id) MATCH SIMPLE,
	CONSTRAINT "b2c_user_academic_&_stream_FK" FOREIGN KEY (stream_id)
        REFERENCES public.stream (id) MATCH SIMPLE
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_academic
    OWNER to postgres;
	
-- Table: public.b2c_user_award
CREATE TABLE public.b2c_user_award
(
    id serial NOT NULL,
    user_id bigint,
    title character varying COLLATE pg_catalog."default",
    detail text COLLATE pg_catalog."default",
    file_url character varying COLLATE pg_catalog."default",
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modify_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_award_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_award_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_award
    OWNER to postgres;
	
-- Table: public.hobby
CREATE TABLE public.hobby
(
    id serial NOT NULL,
    title character varying(250) COLLATE pg_catalog."default" NOT NULL,
    "desc" text COLLATE pg_catalog."default",
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modify_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT hobby_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.hobby
    OWNER to postgres;
COMMENT ON TABLE public.hobby
    IS 'hobby will contain the list of hobby of the users ';
	
-- Table: public.b2c_user_hobby

CREATE TABLE public.b2c_user_hobby
(
    id serial NOT NULL,
    user_id bigint NOT NULL,
    hobby_id bigint NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_hobby_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_hobby_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE,
	CONSTRAINT "b2c_user_hobby_&_hobby_FK" FOREIGN KEY (hobby_id)
        REFERENCES public.hobby (id) MATCH SIMPLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_hobby
    OWNER to postgres; 
	
-- Table: public.industry

CREATE TABLE public.industry
(
    id serial NOT NULL,
    name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    details text COLLATE pg_catalog."default",
    create_date_time timestamp(4) without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp(4) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT industry_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.industry
    OWNER to postgres;
COMMENT ON TABLE public.industry
    IS 'The list of Industry will be here. ';

-- Table: public.skills

CREATE TABLE public.skills
(
    id serial NOT NULL,
    name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    "desc" text COLLATE pg_catalog."default",
    primary_skill_id bigint,
    primary_flag boolean,
    CONSTRAINT skills_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.skills
    OWNER to postgres;
COMMENT ON TABLE public.skills
    IS 'The list of Skills will be there in this table. From this table reference will go to other tables. ';

-- Table: public.designation

CREATE TABLE public.designation
(
    id serial NOT NULL,
    name character varying(250) COLLATE pg_catalog."default" NOT NULL,
    details text COLLATE pg_catalog."default",
    "order" bigint NOT NULL,
    create_date_time timestamp(4) without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp(4) without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT designation_pkey PRIMARY KEY (id)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.designation
    OWNER to postgres;
COMMENT ON TABLE public.designation
    IS 'The Designation list will be given here';
	
-- Table: public.b2c_user_professional

CREATE TABLE public.b2c_user_professional
(
    id serial NOT NULL,
    user_id bigint,
    company character varying(200) COLLATE pg_catalog."default",
    designation_id bigint,
    "from" timestamp without time zone,
    "to" timestamp without time zone,
    industry_id bigint,
    website character varying(100) COLLATE pg_catalog."default",
    current_ctc character varying(10) COLLATE pg_catalog."default",
    notice_period character varying(10) COLLATE pg_catalog."default",
    create_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modified_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT b2c_user_professional_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_professional_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE,
	CONSTRAINT "b2c_user_professional_&_designation_FK" FOREIGN KEY (designation_id)
        REFERENCES public.designation (id) MATCH SIMPLE,
	CONSTRAINT "b2c_user_professional_&_industry_FK" FOREIGN KEY (industry_id)
        REFERENCES public.industry (id) MATCH SIMPLE
	
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_professional
    OWNER to postgres;
	
-- Table: public.b2c_user_project

CREATE TABLE public.b2c_user_project
(
    id serial NOT NULL,
    title character varying COLLATE pg_catalog."default",
    type character varying(50) COLLATE pg_catalog."default",
    client character varying COLLATE pg_catalog."default",
    start_date timestamp without time zone,
    end_date timestamp without time zone,
    role character varying(30) COLLATE pg_catalog."default",
    detail text COLLATE pg_catalog."default",
    file_url character varying COLLATE pg_catalog."default",
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modify_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id bigint NOT NULL,
    CONSTRAINT b2c_user_project_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_project_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_project
    OWNER to postgres;

-- Table: public.b2c_user_publication
CREATE TABLE public.b2c_user_publication
(
    id serial NOT NULL,
    user_id bigint NOT NULL,
    title character varying COLLATE pg_catalog."default",
    type character varying(50) COLLATE pg_catalog."default",
    client character varying COLLATE pg_catalog."default",
    author character varying(100) COLLATE pg_catalog."default",
    publish_year character(4) COLLATE pg_catalog."default",
    catation text COLLATE pg_catalog."default",
    version character varying(10) COLLATE pg_catalog."default",
    url character varying COLLATE pg_catalog."default",
    detail text COLLATE pg_catalog."default",
    file_url character varying COLLATE pg_catalog."default",
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modify_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_publication_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_publication_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_publication
    OWNER to postgres;
ALTER TABLE public.b2c_user_publication
  ALTER COLUMN publish_year SET DATA TYPE char (5)
  USING publish_year::char;


-- Table: public.b2c_user_research
CREATE TABLE public.b2c_user_research
(
    id serial NOT NULL,
    user_id bigint,
    title character varying COLLATE pg_catalog."default",
    detail text COLLATE pg_catalog."default",
    file_url character varying COLLATE pg_catalog."default",
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    modify_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_research_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_research_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_research
    OWNER to postgres;

-- Table: public.b2c_user_resume
CREATE TABLE public.b2c_user_resume
(
    id serial NOT NULL,
    user_id bigint NOT NULL,
    resume_url text COLLATE pg_catalog."default" NOT NULL,
    file_name character varying COLLATE pg_catalog."default",
    status boolean,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
	modify_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_resume_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_resume_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_resume
    OWNER to postgres;

-- Table: public.b2c_user_skill
CREATE TABLE public.b2c_user_skill
(
    id serial NOT NULL,
    user_id bigint,
    skill_id bigint,
    rank integer,
    create_date_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT b2c_user_skill_pkey PRIMARY KEY (id),
	CONSTRAINT "b2c_user_skill_&_b2c_user_FK" FOREIGN KEY (user_id)
        REFERENCES public.b2c_user (id) MATCH SIMPLE,
	CONSTRAINT "b2c_user_skill_&_skills_FK" FOREIGN KEY (skill_id)
        REFERENCES public.skills (id) MATCH SIMPLE
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE public.b2c_user_skill
    OWNER to postgres;