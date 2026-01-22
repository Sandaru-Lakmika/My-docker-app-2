To run application - docker-compose up

To start jenkins 8080 - sudo systemctl start jenkins / jenkins start

To see datatables - docker exec -it mysql_db mysql -u root -prootpassword carservice
                    SHOW TABLES;
                    SELECT * FROM users;
                    SELECT * FROM bookings;
                    EXIT;