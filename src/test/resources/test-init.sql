TRUNCATE account, apartment, verification_token, bill, invoice, tariff, usage_report, water_meter, water_meter_check, water_usage_stats,account_details,owner,administrator,facility_manager,role,auth_info,list_search_preferences CASCADE;
TRUNCATE TABLE account, apartment, verification_token, bill, invoice, tariff, usage_report, water_meter, water_meter_check, water_usage_stats,account_details,owner,administrator,facility_manager,role,auth_info,list_search_preferences RESTART IDENTITY;
INSERT INTO public.account_details (id, version, email, first_name, last_name, phone_number, created_on, updated_on)
VALUES (nextval('account_details_id_seq'), 0, 'kontomat@gmail.com', 'Mateusz', 'Strzelecki', '123456789', now(), now());
INSERT INTO public.account (id, version, active, login, password, locale, account_state, account_details_id, created_on, updated_on)
VALUES (nextval('account_id_seq'), 0, true, 'admin', '$2a$04$m9vbbL2RTbV/XNC44TEZ0e.t9WH2Q6hjtyEem/siFCdNS564hW68q', 'en_US', 'CONFIRMED', 1, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('ADMINISTRATOR', nextval('role_id_seq'), true, 0, 1, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('FACILITY_MANAGER', nextval('role_id_seq'), true, 0, 1, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('OWNER', nextval('role_id_seq'), true, 0, 1, now(), now());
INSERT INTO public.administrator (id)
VALUES (1);
INSERT INTO public.facility_manager (id)
VALUES (2);
INSERT INTO public.owner (id)
VALUES (3);
INSERT INTO public.auth_info (id, last_ip_address, last_success_auth, last_incorrect_auth, incorrect_auth_count, created_on, updated_on, version, account_id)
VALUES (nextval('auth_info_id_seq'), null, null, null, 0, now(), now(), 0, 1);
INSERT INTO public.account_details (id, version, email, first_name, last_name, phone_number, created_on, updated_on)
VALUES (nextval('account_details_id_seq'), 0, 'kontosz@gmail.com', 'Szymon', 'Ziemecki', '123412341', now(), now());
INSERT INTO public.account (id, version, active, login, password, locale, account_state, account_details_id, created_on, updated_on)
VALUES (nextval('account_id_seq'), 0, true, 'new', '$2a$04$j/yqCtlHxKmdxHMWxaji4OD1w591LIMNDGBqUbCpD6HTM4aj2uLiS', 'en_US', 'CONFIRMED', 2, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('OWNER', nextval('role_id_seq'), true, 0, 2, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('FACILITY_MANAGER', nextval('role_id_seq'), false, 0, 2, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('ADMINISTRATOR', nextval('role_id_seq'), false, 0, 2, now(), now());
INSERT INTO public.owner (id)
VALUES (4);
INSERT INTO public.administrator (id)
VALUES (5);
INSERT INTO public.facility_manager (id)
VALUES (6);
INSERT INTO public.auth_info (id, last_ip_address, last_success_auth, last_incorrect_auth, incorrect_auth_count, created_on, updated_on, version, account_id)
VALUES (nextval('auth_info_id_seq'), null, null, null, 0, now(), now(), 0, 2);
INSERT INTO public.account_details (id, version, email, first_name, last_name, phone_number, created_on, updated_on)
VALUES (nextval('account_details_id_seq'), 0, 'tomdut@gmail.com', 'Tom', 'Dut', '666666666', now(), now());
INSERT INTO public.account (id, version, active, login, password, locale, account_state, account_details_id, created_on, updated_on)
VALUES (nextval('account_id_seq'), 0, true, 'tomdut', '$2a$04$j/yqCtlHxKmdxHMWxaji4OD1w591LIMNDGBqUbCpD6HTM4aj2uLiS', 'en_US', 'CONFIRMED', 3, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('FACILITY_MANAGER', nextval('role_id_seq'), true, 0, 3, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('OWNER', nextval('role_id_seq'), false, 0, 3, now(), now());
INSERT INTO public.role (permission_level, id, active, version, account_id, created_on, updated_on)
VALUES ('ADMINISTRATOR', nextval('role_id_seq'), false, 0, 3, now(), now());
INSERT INTO public.facility_manager (id)
VALUES (7);
INSERT INTO public.owner (id)
VALUES (8);
INSERT INTO public.administrator (id)
VALUES (9);
INSERT INTO public.auth_info (id, last_ip_address, last_success_auth, last_incorrect_auth, incorrect_auth_count, created_on, updated_on, version, account_id)
VALUES (nextval('auth_info_id_seq'), null, null, null, 0, now(), now(), 0, 3);