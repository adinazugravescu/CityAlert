DO
$$
BEGIN
   IF NOT EXISTS (
      SELECT
      FROM pg_catalog.pg_roles
      WHERE rolname = 'cityalert'
   ) THEN
      CREATE ROLE cityalert LOGIN PASSWORD 'cityalert';
   END IF;
END
$$;

SELECT 'CREATE DATABASE cityalert OWNER cityalert'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'cityalert')\gexec
