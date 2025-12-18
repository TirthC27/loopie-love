@echo off
echo Testing Firebase storage...
echo.

curl -X POST http://localhost:4000/test-store ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@loppilove.com\"}"

echo.
echo.
echo If you see {"success":true} above, check Firebase Console now!
echo Go to: Firebase Console - Firestore - waitlist_users
echo.
pause
