-- EMP , DEPT, BONUS, SALGRADE, DUMMY --

SELECT * FROM EMP;
SELECT * FROM SALGRADE;
INSERT INTO BONUS(ENAME,JOB,SAL,COMM) VALUES ('DAN','ANALIST',200,100);
UPDATE BONUS SET SAL = 400
WHERE ROWNUM < 3;
SELECT * FROM BONUS;
DELETE FROM BONUS WHERE ENAME = 'SCOTT' and  SAL = 200;


COMMIT;
ROLLBACK;
