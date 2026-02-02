---
title: "Starting with Joomla - II"
pubDate: "2007-03-25"
source: "bitterness"
original_id: 31
slug: "starting-with-joomla-ii"
---

יש שתי דרכים עיקריות להתקין ג'ומלה - הדרך הקלה, והדרך הקלה מאוד. נתחיל בדרך הקלה מאוד - אם אתם מאוחסנים בספק טוב (הבלוג הזה יושב על [Dreamhost](http://www.dreamhost.com/r.cgi?283200) המצוינים, אבל ממה שראיתי גם GoDaddy נותנים שרות דומה), אז אתם מקבלים One-click installation לג'ומלה. כל מה שאתם צריכים לעשות זה לתת את שם האתר, לבחור משתמש וססמא ל- Database (כדאי לרשום) ותוך 10 דקות מגיע אי-מייל בסגנון הבא: 

  

We just installed the files for Joomla as requested at:
[[sni](http://www.2fg.pokarov.com/)p]

Step 4:
  You're almost done! FTP to your site and remove the "installation"
  directory. Then click the link at the top for "Administration"
  and log in as "admin" with the password you just set.
Have fun! If you need help, there's a help area in the Admin section,
as well as the official forums here:
[http://forum.joomla.org/](http://forum.joomla.org/)
Thanks!
The Happy DreamHost Installer Robot 

 

כמו שאפשר להבין, מדובר בסדרת צעדים קטנה וחביבה שאחריה, הפלא ופלא, יש לכם אתר ג'ומלה רץ. אתם מוזמנים להכנס ולהתחיל לשחק (עוד בהמשך) 

הדרך השנייה, הקלה לא פחות, היא להתקין לבד. מתחילים מלהוריד את הקבצים. יש כמה מקומות שאפשר להוריד, וכאן נכנסת השאלה החשובה - רוצים עברית? אתם בטוחים? אתם ממש, ממש, בטוחים? אולי בכל זאת? טוב, נו. אם אתם רוצים עברית יש שתי דרכים לקבל אותה - או להתקין ג'ומלה רגיל ואז להוסיף את חבילת התרגום, או להוריד מראש גרסא עם התרגום בילט אין. ההעדפה האישית שלי - תתקינו גרסא רגילה (אפשר להוריד מהאתר של ג'ומלה ומעוד מקומות), ואז פשוט תוסיפו את החבילה של עברית. בכל מקרה, מקור טוב להורדות בעברית הוא באתר של [קהילת ג'ומלה בישראל.](http://www.joomla.co.il/component/option,com_docman/task,cat_view/gid,40/)  

עוד שתי המלצות לדרך: 

   

 

לפני שאתם מתחילים להעלות דברים לאתר הפרודקשן שלכם, בו השקעתם את מיטב ממונכם, תרימו לעצמכם שרת ג'ומלה לוקאלי. עליו תעשו את כל הניסויים עם התבניות, עם להוסיף ולהוריד מודולים וכל הבוג'ע-ראס. ככה לא תשלמו על כל טעות כתיב ב- PHP בזמן יקר. בשביל להריץ ג'ומלה צריך ארכיטקטורת LAMP (כבר דיברנו עליה פה) או WAMP. המפתחים הרציניים שבינינו מרימים לבד: 
 -  [Apache](http://httpd.apache.org/download.cgi) -  [MySQL](http://mysql.org/downloads/) -  [PHP](http://www.php.net/downloads.php)

 

ואז מקנפגים כל מה שצריך (וצריך).הבעיה העיקרית היא לבחור גרסה יציבה - איזו גרסא של PHP משחקת יפה אם איזו גרסה של Apache זה משהו שאתם באמת לא רוצים לגלות לבד. גם הקנפוג עצמו (של לגרום להם לעבוד ביחד) הוא לא בדיוק פיסיקה קוואנטית למתקדמים, אבל מנסיון - הוא לא הולך חלק. מכיוון שאנחנו קצת זקנים והרבה עצלנים אנחנו ממליצים על חבילה מוכנה. . יש באתר של ג'ומלה להוריד שרת ג'ומלה לוקאלי, שאותו לא ניסינו. מה שכן ניסינו ואנחנו משתמשים על בסיס יום-יומי הוא [EasyPHP](http://www.easyphp.org/?lang=en) - חבילת תוכנה קטנה וזריזה שמתקינה לכם את כל השלישיה הסודית כשהיא כבר מקונפגת ומותאמת לעבודה היטב. היתרון המרכזי של EasyPHP על להתקין איזה שהוא שרת ג'ומלה ייעודי - שאפשר להשתמש בה גם לדברים אחרים. במיוחד אם אתם בתהליך של אבלואציה לפלטפורמה (נניח, מתלבטים בין ג'ומלה לממבו או כל פלטפורמת LAMP/WAMP אחרת) אתם יכולים עם EasyPHP להרים את כל הסביבות האלו בבת אחת ולקבל החלטות.  

    

 המלצה שנייה: ג'ומלה אמורה לאפשר למשתמשים 'רגילים' (לא טכניים) ליצור תוכן בקלות. אל תתנו לזה לבלבל אותכם - מי שמרים את האתר, צריך להיות מאוד טכני, עם יכולות PHP, SQL ובאופן כללי - כזה שלא מפחד לשחק. גם כל התקנות הקסם האלו אצל הספקים מתקינות לכם משהו מאוד מאוד בסיסי. רוצים תוכן ומהר - תבקשו ממישהו שמכיר, עם רקורד מוכח.  

    

עכשיו שהתקנתם, אפשר להתחיל לשחק. עוד על המשחקים - בפוסט הבא.. Technorati tags: [ג'ומלה](http://technorati.com/tags/%d7%92'%d7%95%d7%9e%d7%9c%d7%94), [CMS](http://technorati.com/tags/CMS), [WAMP](http://technorati.com/tags/WAMP), [LAMP](http://technorati.com/tags/LAMP), [PHP](http://technorati.com/tags/PHP), [Apache](http://technorati.com/tags/Apache), [MySQL](http://technorati.com/tags/MySQL), [Joomla](http://technorati.com/tags/Joomla)