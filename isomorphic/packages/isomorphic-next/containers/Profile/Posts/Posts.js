import React, { useState, Fragment } from 'react';
import Link from 'next/link';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import {
  FiHeart,
  FiShare,
  FiBookmark,
  FiMessageCircle,
  FiMoreHorizontal,
} from 'react-icons/fi';
import Modal from '@iso/ui/Antd/Modal/Modal';
import PostCard from '@iso/components/PostCard';
import AvatarCard from '@iso/components/AvatarCard/AvatarCard';
import Comments from './comments';
import PostsWrapper, { Button, ContentWrapper } from './Posts.styles';
import SlickCarousel from '../SlickCarousel/SlickCarousel';

const Posts = ({ data, avatar, username }) => {
  const [currentPost, setCurrentPost] = useState(1);
  const [visible, setVisible] = useState(false);

  const showSelectedPost = (data) => {
    setCurrentPost(data.id);
    setVisible(true);
  };

  const renderHtml = (data) => {
    return { __html: data };
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handlePrevPost = () => {
    setCurrentPost(currentPost - 1);
  };

  const handleNextPost = () => {
    setCurrentPost(currentPost + 1);
  };

  let newData = {};

  data.forEach((item) => {
    if (item.id === currentPost) {
      newData = item;
    }
  });

  return (
    <PostsWrapper>
      {data.map((item) => (
        <PostCard
          key={item.id}
          variant="instagram"
          type={item.type}
          image={item.thumb_url}
          numberOflike={item.numberOflike && item.numberOflike}
          numberOfView={item.numberOfView && item.numberOfView}
          numberOfcomment={item.numberOfcomment}
          onClick={() => showSelectedPost(item)}
        />
      ))}

      <Modal
        wrapClassName="instagram-modal"
        open={visible}
        onCancel={handleCancel}
        footer={null}
      >
        {currentPost > 1 && (
          <Button className="prev" onClick={handlePrevPost}>
            <IoIosArrowBack />
          </Button>
        )}
        {currentPost < data.length && (
          <Button className="next" onClick={handleNextPost}>
            <IoIosArrowForward />
          </Button>
        )}

        <ContentWrapper>
          <div className="media">
            {newData.type === 'image' && (
              <img src={newData.thumb_url} alt={'post'} />
            )}

            {newData.type === 'gallery' && (
              <SlickCarousel data={newData.gallery} />
            )}

            {newData.type === 'video' && (
              <div
                className="video-container"
                dangerouslySetInnerHTML={renderHtml(newData.video)}
              ></div>
            )}
          </div>

          <div className="content">
            <header className="header">
              <div className="avatar-wrapper">
                <AvatarCard avatar={avatar} username={username} />
                <span>•</span>
                <Link href="/dashboard/my-profile">
                  <a>Follow</a>
                </Link>
              </div>
              <button type="button">
                <FiMoreHorizontal />
              </button>
            </header>

            <div className="body">
              <div className="comments">
                {newData.comments !== undefined && newData.comments.length > 0
                  ? newData.comments.map((item) => (
                      <Comments
                        key={`comment-key${item.id}`}
                        role={item.role}
                        avatar={item.avatar}
                        name={item.username}
                        content={item.comment}
                        time={item.time}
                        handleLike={() =>
                          console.log(
                            'Write like function for post.',
                            newData.id
                          )
                        }
                        handleReply={() =>
                          console.log(
                            'Write reply function for post.',
                            newData.id
                          )
                        }
                      />
                    ))
                  : ''}
              </div>
            </div>

            <footer className="footer">
              <div className="top-bar">
                <button className="like" type="button">
                  <FiHeart />
                </button>
                <button className="comment" type="button">
                  <FiMessageCircle />
                </button>
                <button className="share" type="button">
                  <FiShare />
                </button>
                <button className="bookmark" type="button">
                  <FiBookmark />
                </button>
              </div>
              <div className="activity-info">
                <h5>{newData.numberOflike} likes</h5>
                <time>AUGUST 31</time>
              </div>
            </footer>
          </div>
        </ContentWrapper>
      </Modal>
    </PostsWrapper>
  );
};

export default Posts;
