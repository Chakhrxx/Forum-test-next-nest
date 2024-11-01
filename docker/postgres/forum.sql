PGDMP      8            	    |            forum    17.0    17.0     Y           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            Z           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            [           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            \           1262    16384    forum    DATABASE     q   CREATE DATABASE forum WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.UTF-8';
    DROP DATABASE forum;
                     admin    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
                     admin    false            ]           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                        admin    false    6            ]           1247    16554    post_community_enum    TYPE     �   CREATE TYPE public.post_community_enum AS ENUM (
    'History',
    'Food',
    'Pets',
    'Health',
    'Fashion',
    'Exercise',
    'Others'
);
 &   DROP TYPE public.post_community_enum;
       public               admin    false    6            �            1259    24582    comment    TABLE     "  CREATE TABLE public.comment (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    message character varying NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    updated timestamp with time zone DEFAULT now() NOT NULL,
    "postsId" uuid,
    "usersId" uuid
);
    DROP TABLE public.comment;
       public         heap r       admin    false    6    6    6            �            1259    24592    post    TABLE     h  CREATE TABLE public.post (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    title character varying NOT NULL,
    description character varying NOT NULL,
    community public.post_community_enum NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    updated timestamp with time zone DEFAULT now() NOT NULL,
    "usersId" uuid
);
    DROP TABLE public.post;
       public         heap r       admin    false    6    6    6    861            �            1259    24632    query-result-cache    TABLE     �   CREATE TABLE public."query-result-cache" (
    id integer NOT NULL,
    identifier character varying,
    "time" bigint NOT NULL,
    duration integer NOT NULL,
    query text NOT NULL,
    result text NOT NULL
);
 (   DROP TABLE public."query-result-cache";
       public         heap r       admin    false    6            �            1259    24631    query-result-cache_id_seq    SEQUENCE     �   CREATE SEQUENCE public."query-result-cache_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 2   DROP SEQUENCE public."query-result-cache_id_seq";
       public               admin    false    6    222            ^           0    0    query-result-cache_id_seq    SEQUENCE OWNED BY     [   ALTER SEQUENCE public."query-result-cache_id_seq" OWNED BY public."query-result-cache".id;
          public               admin    false    221            �            1259    24602    user    TABLE        CREATE TABLE public."user" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    created timestamp with time zone DEFAULT now() NOT NULL,
    updated timestamp with time zone DEFAULT now() NOT NULL
);
    DROP TABLE public."user";
       public         heap r       admin    false    6    6    6            �           2604    24635    query-result-cache id    DEFAULT     �   ALTER TABLE ONLY public."query-result-cache" ALTER COLUMN id SET DEFAULT nextval('public."query-result-cache_id_seq"'::regclass);
 F   ALTER TABLE public."query-result-cache" ALTER COLUMN id DROP DEFAULT;
       public               admin    false    221    222    222            R          0    24582    comment 
   TABLE DATA           V   COPY public.comment (id, message, created, updated, "postsId", "usersId") FROM stdin;
    public               admin    false    218   �%       S          0    24592    post 
   TABLE DATA           ^   COPY public.post (id, title, description, community, created, updated, "usersId") FROM stdin;
    public               admin    false    219   *       V          0    24632    query-result-cache 
   TABLE DATA           _   COPY public."query-result-cache" (id, identifier, "time", duration, query, result) FROM stdin;
    public               admin    false    222   �,       T          0    24602    user 
   TABLE DATA           G   COPY public."user" (id, username, email, created, updated) FROM stdin;
    public               admin    false    220   �,       _           0    0    query-result-cache_id_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('public."query-result-cache_id_seq"', 1, false);
          public               admin    false    221            �           2606    24591 &   comment PK_0b0e4bbc8415ec426f87f3a88e2 
   CONSTRAINT     f   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.comment DROP CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2";
       public                 admin    false    218            �           2606    24639 1   query-result-cache PK_6a98f758d8bfd010e7e10ffd3d3 
   CONSTRAINT     s   ALTER TABLE ONLY public."query-result-cache"
    ADD CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY (id);
 _   ALTER TABLE ONLY public."query-result-cache" DROP CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3";
       public                 admin    false    222            �           2606    24601 #   post PK_be5fda3aac270b134ff9c21cdee 
   CONSTRAINT     c   ALTER TABLE ONLY public.post
    ADD CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.post DROP CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee";
       public                 admin    false    219            �           2606    24611 #   user PK_cace4a159ff9f2512dd42373760 
   CONSTRAINT     e   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "PK_cace4a159ff9f2512dd42373760";
       public                 admin    false    220            �           2606    24641 &   comment UQ_0b0e4bbc8415ec426f87f3a88e2 
   CONSTRAINT     a   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "UQ_0b0e4bbc8415ec426f87f3a88e2" UNIQUE (id);
 R   ALTER TABLE ONLY public.comment DROP CONSTRAINT "UQ_0b0e4bbc8415ec426f87f3a88e2";
       public                 admin    false    218            �           2606    24613 #   user UQ_78a916df40e02a9deb1c4b75edb 
   CONSTRAINT     f   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb";
       public                 admin    false    220            �           2606    24643 #   post UQ_be5fda3aac270b134ff9c21cdee 
   CONSTRAINT     ^   ALTER TABLE ONLY public.post
    ADD CONSTRAINT "UQ_be5fda3aac270b134ff9c21cdee" UNIQUE (id);
 O   ALTER TABLE ONLY public.post DROP CONSTRAINT "UQ_be5fda3aac270b134ff9c21cdee";
       public                 admin    false    219            �           2606    24615 #   user UQ_e12875dfb3b1d92d7d7c5377e22 
   CONSTRAINT     c   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);
 Q   ALTER TABLE ONLY public."user" DROP CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22";
       public                 admin    false    220            �           2606    24621 &   comment FK_7be841194147978a20d2b4720c7    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_7be841194147978a20d2b4720c7" FOREIGN KEY ("usersId") REFERENCES public."user"(id);
 R   ALTER TABLE ONLY public.comment DROP CONSTRAINT "FK_7be841194147978a20d2b4720c7";
       public               admin    false    3255    218    220            �           2606    32774 &   comment FK_bd1e56cab2b71634fa21422d864    FK CONSTRAINT     �   ALTER TABLE ONLY public.comment
    ADD CONSTRAINT "FK_bd1e56cab2b71634fa21422d864" FOREIGN KEY ("postsId") REFERENCES public.post(id) ON DELETE CASCADE;
 R   ALTER TABLE ONLY public.comment DROP CONSTRAINT "FK_bd1e56cab2b71634fa21422d864";
       public               admin    false    218    219    3251            �           2606    24626 #   post FK_dd06703f64e32aa9ca8c63ee722    FK CONSTRAINT     �   ALTER TABLE ONLY public.post
    ADD CONSTRAINT "FK_dd06703f64e32aa9ca8c63ee722" FOREIGN KEY ("usersId") REFERENCES public."user"(id);
 O   ALTER TABLE ONLY public.post DROP CONSTRAINT "FK_dd06703f64e32aa9ca8c63ee722";
       public               admin    false    3255    220    219            R   W  x����r�8�����<$��g�;�i����aKN�D��"3q�����G��R��] j�B�_kX��_~������I�U_Ͽ��g9�c??��-�O��Ѯj�������tw�<�N��;��G�����(���_�:|��2��P�
�Ii�Rs@�<�T�˭@��Fb��$�H8ˎ���Q���Fg�>qY�ˠ>���do�k�kZt�T�?�uF�x>=����8nA��C.���ѯ��:�fT ��z�"�8���t��ջ��'}�ü�~h?'�0�@�ɧm�u�!Tɥ���%n�FsP��))�{��8Z"X���#T.	�5!9\uzէ����{�����,�b�.�Mһ�C���b��#d���.i�(�A�����C4:&-��8w+�z?���u��X�?��ef��B�趛�.�u�q���'�#C��۳��E���ܧ����^���K�>�;�r�M޻�G8�N�a�Z+��"tʱU$�i���Y�����2m�1��و�������m��B!���h�ܤ��]Hou��������~D�o���1��ht�L�C�w �6��;�ÍZz���I�w�W+7Z�R5)���=}4��z��]�V�N
�j$^��m��Tu���Y�.R|����}>��{n��!b)�5��_�.[G[k���T�Z��j�*<xZ)��Uva�}g����P1C-��T61�a��(<R��Ԑ�����ݹ�m�NR�Ô�Q2L&+%k�A�#e�k��s�H�=\����$���7�u}�D���`؆_�����\�Xs�jO�&�3�k���?]��t|-yx�9V�����XKD�����S�&(���@�d���9K�ѣ����bR,=�0țrۖEM�\�Gpq�X��@s���@���;���o7�g�@���K�Q�&�A�
�����4'JfB��6F��QC��B�d�3���Tq�.��w�����q;�6�2�Kj66*#*��C��uМ��P;8�HP7��:�RE0/���V(u�*�m�lÙ��R�m�,�����پ{�r���x����?3�j����"?�-�{��v����      S   �  x���K��6���ྸ�%y��nҦ�"@�Ȳ>.c"˵4Ӥ��T����z��JE���PZ˄� �@H�
>����
�l����s;~�i>p<�2?��Z9��E��X9���'^D<q��N��Ï�\��@"('�N�LdG��G��Q���%%��b����.{*���p��";#��@1$U<�|��x&5<<�?6����:|ܷE���<�y�������j�O-/b��U�60ю+�yY���u�?�2&�������%�+�.(���X4��؀�ҰJ6h�Y�H�[U�c���W,�UK������4PH��;�K͵J�w�1�%����cg+k��T�� ~�_�9�Sg�U��ui��k}:�CG�b�E���U�秵/@q�mkۘ~�xX��B���Ʉ�4Z��n�wE$�uZ��q��	t1�g]S�p1#��k[1W���s[xx��t��[<��w��魘m�3��S'[���]�	�&eF-e?�h/ԻЬ�u,�9�TK��W���Y�*�3U����fW��:'o�\�w�PT1f�f��*A�*�D,�
�{3
��>���\�w�p����-	�Z���AN�9z�И��tf�4�>Gt�z�}R\U�}[;��9�2y��"~���7�`��ߗ�XW�]X�����O��M      V      x������ � �      T   �  x�}V=o#G��������!�r�4צM3�� �s ]���P�t��� o�g�3��HM�GS��f�6:X�B�Mz���y�������_/}������@H��L��ê�%�o��O�eP��M�Hc`&��>A�h�.�jz�9�zx��a�®�-�nU�d�)T�>'TnF�GL4]��۷9�_ƿ����c_\�ʆ���-�$&�;h�l5�E+���6g���,��/?���'����0��ްK�7)f%F#�ed����\)�~��m0�>Օe����Gv�YX�x�C�z�t�Q) ���Y��|.4�]�r�5�[s���%�̊�Z�.���0�7>��Ӭz�Z~���L�h>ň$;��e N��C��bIP���)a�)�k��\�3���a�b^ŝ�����G�	c����<�V������4��@�5Y��L^�(+iNb;��Ez �^���\���B�8��[��m	����>�[7���$z�Gv�6�����N��PŻ.5Pm1�e�r�'EG܄֘0�{�=�I�i���4�yL�� ��'u{77e��gEǰ!�$n����X��;9���]Z�1xf儳E/��,9\`���%�F���I�����ԋ�H��7[�P�x�vK���P������P�:���q�x8�����=vq����B�|����O�FU�:��w�Y�+~�S�ߝV�Q�A�6��}�zd�c�ZY�s�C|��葶��7�舕��S�����/N:�ՂH�٥��c-Ըy����A����c�T������zx.�����v�oY���� y�}�g-~Gfn�S�I;����s��!)��~�.M�����)����xq��y��ɋ��N_q��w�F��b��~d��K���{����p�z�sLN�4���t�I��	�uo�e�6-8fC? 8���E��Tu���偼�����}2���-���.��?�<h     