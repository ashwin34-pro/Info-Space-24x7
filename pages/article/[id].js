import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import Auth from "../../components/Auth";
import axios from 'axios';

export default function ArticleDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState({});
  const [user, setUser] = useState(null);
  const [fullContent, setFullContent] = useState('');

  useEffect(() => {
    if (id) {
      fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEXT_PUBLIC_NEWSAPI_KEY}`)
        .then(res => res.json())
        .then(data => setArticle(data.articles[id]));
    }
  }, [id]);

  useEffect(() => {
    async function getDetail() {
      if (article?.url && user) {
        const res = await axios.post('/api/get-full-article', { url: article.url });
        setFullContent(res.data.content);
      }
    }
    getDetail();
  }, [article, user]);

  if (!user)
    return (
      <div>
        <Auth onUserChanged={setUser} />
        <p>Please sign in to view the full article.</p>
      </div>
    );

  return (
    <div>
      <h2>{article.title}</h2>
      {article.urlToImage && <img src={article.urlToImage} style={{maxWidth: '80vw'}} />}
      <p>{fullContent || article.description}</p>
      <a href={article.url} target="_blank">Read Original</a>
    </div>
  );
}
