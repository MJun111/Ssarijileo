// Path: 'profile/'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';

import ContentForm from '@/components/profile/ContentForm';
import FriendForm from '@/components/profile/FriendForm';

import styles from '@/styles/profile/Profile.module.scss';

function MyPage() {
  const DUMMY_DATA = {
    name: '서예지',
    nickname: 'zㅣ존예지',
    micVolume: 0.5,
    echo: 0.5,
  };

  const [themeMode, setThemeMode] = useState('light');
  const [type, setType] = useState('계정 관리');

  const storeTheme: any = useSelector<any>(state => state.theme);

  useEffect(() => {
    setThemeMode(storeTheme.theme);
  }, [storeTheme]);

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.sidebar}>
          <div className={styles.profileImg}>
            <Image
              src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJAAlwMBIgACEQEDEQH/xAAbAAACAgMBAAAAAAAAAAAAAAAFBgMEAQIHAP/EADsQAAIBAwMBBQUFBgYDAAAAAAECAwAEEQUSITEGE0FRYSJxgZGhFDKxwdEjQlLh8PEHJENicoIVM6L/xAAZAQADAQEBAAAAAAAAAAAAAAACAwQBAAX/xAAhEQACAgIDAQADAQAAAAAAAAAAAQIRAyESMUFRIjJhE//aAAwDAQACEQMRAD8AHFcLUXWrjplDVQDnBp0WNSNCBT72Sla90yMSXJlnR2TaxyYl4PJx+vX4BU0/SHvonmN1bW0StjdPJtyfdRu4nhs7K2fSiI50fu0njjH7UeIJNBk3oyQd7WQ2/wD4iJZYyuHULKAPZODx54NIksLQzPESrbTjK9DRLVdbvNQjENwIlVcZVR1IOc8nj4UMjPJzXY4tGJUYWLd1q3bwbME9Kj3xQxNLM4SNBlmPQClrV+0Vxcq0dluggHGRw7+/yHoPjWylWguLY4y3lrbsI5Z0WQnAXOST7hUtxItkXF5mDZjd3gIx+tclt797K7iuYjumicOhc5XI6ceNEdY16+1eSF7iTYndBWVFwGbJJPU+lKD4MfRrenO2Eu4mOegNXYLqGUDa9ckeAkDD5Y9D0Nb6fqd9pkveQSsVB5RjkGiMeI7EtR3KZSgGgdpra/RQ4MT9CG6Z9DTHKN0WV5rUJkq7Bp4bFYIzUrJn31GeKahbsltFXePuhs/ecjCjxPPWoNc1C7eIxQhmWMnY646H0x19axnmtWJpiMU+PgO0m1aCB3nXMzHG49ceAr1EM16tFzlydnnSq8sGOQKIbM1rOrBPYHNRqVHoJA5I89OD60yWOgX13pIZbhEt3fvBGwJ5Axn39aDpbnbnxojBql3b26xRsAE4BIz7PlRttrQE/wCA7ULR7KdoZMZHII6EedV05G6ruo3cuoMDIntL+91NUL6ZLGwmuX6RJnHmfCiWkcuha7TX/fXItFb9lD94eBf193T50Ejl72RgOEAxmqffSTylnbJZiWPr40T0WVLTUba4MPexwzI7R7sb9rZxSm72PqkMdr/h1rN1aTXF19n02CK378vcnkjnggfd6ZOemR8FqOJGtPYbdtyS48a6V2h7TTdq9IuNN0vS7iFbogSXE8gwqZHQKTkkDHlg8ZoPZdk3toCsgbaRgZ/GlSmkbjUn+wkqFZcAYI5OPGo5YhJkZw2M5pgvtDa3ZypwV/dC+FA7lWgO4jpgk46iijJPo1xaK9pO9jcgMMo3Dr4EfrXVeyesTC3ZO8D+xt3MN25CMqT/AF4VyqcCRDjkjke7ypw7BztKrxsSdiAD4H9DRoTljasb8cnJyfOoH+8asEY4qvIDupkeyd9GAuajdcGp0HFasOaNS2A46IFRmbCqWJ6AeNeqTBU5BIPpxWKPkL4F9YuK0kGOBVwpULJ7VRx7L6pEAXA5qNl4NWgmetatHxTEAygBzSx28vO7s0tFPLtlgPpTfIgQE+Vcw7SXRu9Vck5VDmtmw8atguI92SfEfjR/svpr6hcqgHsZ9r9KXo0aSRUCklj5da7H2R0YadaRysheRlyFXzqfJKkUr6MOmaZFZwqAoJA6Y4FTXKjHQUPuu0F1bnaujTuP4g4/Ko7TWftz7WtpIm/hbwpDMqT2YvbaNkJZFyOc4rnvaayjjDuq469K6BqV9BbRMZm2ikHtNqlvd20ghRwfMrithphLoToH24z5c0y9g7gRaubdjjvYiF/5Ajj5D6UtEBen3cYre0u5LO5iuYz+0hcNjz/rp8arQuUbVHZG6+dRMMms21wlzbRzIcq67gawxoiKjXNYNY8a8aw00b2jjyrFZOK9RcgeIbKmtobcTXMcTNtVjzUhrDIQwdSQw6GkofKRYexjtlluJEYJ0iU/vH8uKGz4JJVQoPRR4VeurmW4jiSXG2MYGPH1qhOwC/hTIikBtal227DnGCDjyxlvpkfGuX3+S7yOPadsn510XtGcW7jP+n9D/aue6mBtUDxPy4oJPZXiVItaVCxliXkjvFA4zt5x8K7cbOY6eEtGVZFUBd3SuY6JBZzaCLiCVVuIQDLFkAlwRyR88H311rT7kNErDow8amm7Y2X1CBrlpryRoE1MrIXxKGyqoM9UA6+WD8KPdlrW7uId111wRu/i9aZJxFI2XRT76mgeMLtTAHkK67Ac9aEPXYC2tGJuVjQtjHWkjtU159o7ufuwqoPZjxhc84+HI8c4z44roHaWcWvaWFmHszJsz65oD2js4BdIZUyjqvPr7Q/MVsXxYxK0c7Kl42OOd1Re/p0NWrkdzKY+o3YU1c7O3OmWetRT63aLdWO11lhK7snacEDI8cVQnoF6HXsVcG40GFSctHlPkaMSHLVc7LdrNF1K3SGOxa3t9PKpCrLkAMCAcAny8fQ+NQ6hKk15NIgUKzkjaMDHuooshlfLZW6da1Zuaw3NRE80VWDZJmvVC74r1bxObGwDmtyOK8BzWXwOvSkhSZDIODQ24P7TA6LwfSr8zMAADtJ6Gh91tjRRyATtVfE+tFdGxQrdop8iZ8EA4RQec+tJt+neA4/dximPtJJuuTEfvAlSB0A4/nQGUjbIceR+tLvZdFaBhZkkjmUe0jAr7x/au7dnLlbrTIJVYEFAQRXD7ldveLjj7yn1HBroX+GeosdNNs5yI3IjPoecfU0GXqzqOhupI461DdQXyQKLCaGNt2XaWMtx5Dkc1hp22ExjLY4FK+rX/aEAj7RawIASUTOW/wCxpVhY8UpypArtANXvdXiM6xiFcMjA9OeTW/aVlksFO7206UAvtS1htRRZJlO4jYu/OB8ulY1+/IgCs2WxzRqL0MnD/N0Kt9LvufOpTLOLMQBz3LsGZfJgOo8v5VUJ3ycck8CiRjAdk6gCnvoT2Wuzl1JZTK8bHBI7xB4gf3z8K6PvV0DpgqwyCK5totpJfavbWkTBGncoGY4A4J/WnbRpybVUDBkwDgdBWxYjPH0vMaicjmpH6+VVpTzinRJWYzmvVpnHWsUQA9AVpIM8Hwomunbukn0oXqw+zM6K24/dIFTIZdsHyTbmLgFieEUeXgfdQ6/m+yQy3MzZZExnwBPgKKwosaEsQSOSemf6zSZ2kvTcb3XPdRZ2f7m5y/5D41zG41bFq4mMs8szdef51VI/ypOeSDXmyICvJLdR51iY4h2+WBQlhXuyTEWHUM34U2f4a8iaNwdkhGD60Ai0ue8sLmWCMt3POAOvX8hTt2Msfs0MRA6KKDI/xo2uxrhn7lxHdHHk/gf0NbaraafdW/8Amhvx0w2KmuIRNFhlB4pX1a1lgQmN3CjwzmkIGKt2AtbtrWyf/Lcn1OaTNSuGmudo+6oyfWmi/WWUN3jEigEenyXN4yIudxAPoPH8qoxhSv0r6dbd46uf3T9anuPYkz05x+tW7WH7M/csOVfafhVS7IYLxyCfxou2YRbSGwCcgdfjThpMvdSq68qyAsPlzSo+e6jx1JG7HnxTHoayRq3eD/TGPif5Vq7F5OhiU4THlwKgY5JraL2YFGedvNaHgmqERNGCaxWpPNerTKOoJdRw2hdnDMQeF60Fuv299LIFAQoB1z7XnUpOeT4VXllWIbm8RwB1J8qno5IF6/dRrFHbQRSiVjiQr1OevT0zzSb2lkEBS2PBChm4xyRx8sUz38/cXmWAkupF3Fc5CDjGfTr7+gpB1CWW7v5GlOWJ5Y8ULLMUSnI20qw5HhUsNuZGhhAyzNu+NbMuzDYzjA+PiaZOwmlm+v8A7Q4yijHI/rzFZY5ulY59k9BW20Q5RS0koOG8RjGPnmore0XTb+SzjGIwA0YPUA+HwOfpVLtxetNd2+lWLNsszlyhxuk9/wDtH1J8qJaW9zqNqF1GPdexj9jdfvH0fz8OetbPHaJ4yadvphZfuc0K1aMSIy0TJeKPbMgB8weKi7kSnmpWmh0X6I17agext5PpVzsboqzm8maLc6sEUnw4yfxFHrvSQ9woQZY9AOau3F5ZdkNOK3bq1xITIsEf3mY/gOOtNxXZ2adxpdnKdTi7jUpAePbZzQeQEls+B/MUUvppLq8mml6yszAZ6ZBOPwobP7O4+YzTUF4QK4Kxd2X3fvknjrximjRH7yBgf4sfAVp2c0O1udAuL+X2yiK8hYcRqrEHaRznGCfdXuzLxzi4UttRS23vGweQcfUUSEydph/nb8KiZua1ilLxq3n4Vq55pqJqCcVhDJo5u3nCS97tCkjlR14+I5r1DEavV2/oND0zKqFmYBQMknyqpaWl3q826AmCBeDORyo8lHi3qeBUh3Xl/DaxnC5LyEenSmW6uI7GzbYqoIo84P3QBS2En8EfttNYdndMW1s4wb2dure058yTXPI7V+7WeXIabJXd1YeJ/GiV3JLrutz3UzPIC3G7+EeHp+VEpLB7i5iaQbmVF3fwqgAKqPTGOPfSmWwXBCzfwm3ijU5zyxyOtO+i3H/gOzMDx4+33fMY8UyOW+APHqfSlW5ga+nu5kci3tysed33iT4fKm/R9Nm1PWjLOmyKMbUTwVR0AoonZOiz2c0N5WFzcAktzzTnb2SxgEAcVNDCsS7VGBVlcAUyyGU22QtaRyxlXXgjpQG6AsrloJD05TOPaBzj8DTTHg+FAe2NsEsV1FUVprXO0lc4DYH44pc4cgsU+L2B9Q1pdMhlaLBugnUjIiz0/wCx+g99c/uO+v5mkkZpJHOWdjknPmaLx2Vxqlw27d3e8s2erE+dMNnoKJgBecUSjxVDnNREDUbFrZI2Zec/jS9dt7GfUiun9ubFYrFWHWPk+/OK5XfHllH7pH50Po+EuUbJtHa6u7iLSYnle3uny8AlKrkDO7y4AzyCOKMSaFdaYZWZBNDG+FnAGGA8cdRSzYXsthcrc25AkAZckZ4IwfpTRcdoLjUIY7SSBYVVt0m1iSzYPyHNGKld6L+muXTavANWixPlWNKjX7OfMisZxIU8FVQffijQiT3o2Q81itM4bNeogToHZpd91dXHl7C5+tD/APELUu4tFsYie8lHt/GivZspBp0lzLgKF3nPl/X40oOX1rWLiRxuZW2Z8mPLfIYX50mYWFbt+HtC0wRWHesPvsAxz18T9Kl1pzY6O4iJNxdYjjOOSzEksPy94pkNoscVtapgB2wf+A+9+nyqgtomqdqkVsfZrE5x4FsHH0H/AMjzoaHc7dsE2Ogiz0dgVy4fc2R0Ow0+6VbLGSVADHrVOa332sqsMFkYkep/vRiFQoBFElQnJkciVlx4V7NS5DL61Ey4NaJJoqh1SD7Xpt1bH/VhZfdkVLGeKyG8eOK44RuzYR4845NM0MQ6kUA0WA293dw4/wDXcyKo9Axx9KZguyLJrWE+xJ7fhjZuvhkiuQXq5nmHmAa7V2thNxbSKF3cZrjN6pW5cHpyDS/S3F+gJI2uOPhRex2mCNwy5V8MuOQPP8aGzL1PiD+NX9GBkDqBnHJ93OaLwMedCUmJ3bnavyrS3j72xurkDpLn5cVLpJEWjzOx5AK+/wAvxq5pFtu7PSgDJZWamR6I5abA27NeqJWr1bYJ/9k="
              alt="profile"
              className={styles.profile}
              width={100}
              height={100}
            />
          </div>
          <div className={styles.name}>{DUMMY_DATA.nickname}님</div>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setType('계정 관리');
            }}
          >
            계정 관리
          </button>
          <button
            type="button"
            className={styles.btn}
            onClick={() => {
              setType('친구 목록');
            }}
          >
            친구 목록
          </button>
        </div>

        <div className={styles.content}>
          <h1>마이페이지</h1>
          <p className={styles.contentHeader}>{type}</p>
          {type === '계정 관리' && (
            <ContentForm theme={themeMode} DUMMY_DATA={DUMMY_DATA} />
          )}
          {type === '친구 목록' && <FriendForm />}
        </div>
      </div>
    </div>
  );
}

export default MyPage;
