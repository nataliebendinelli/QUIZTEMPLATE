import { motion } from 'framer-motion';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  WhatsappIcon,
  EmailIcon
} from 'react-share';

export default function SocialShare({ quizTitle, score, url }) {
  const shareTitle = `I just scored ${score}% on ${quizTitle}!`;
  const shareUrl = url || window.location.href;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8"
    >
      <h3 className="text-lg font-semibold mb-4 text-center">Share Your Results</h3>
      
      <div className="flex justify-center gap-3">
        <FacebookShareButton url={shareUrl} quote={shareTitle}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <TwitterIcon size={40} round />
        </TwitterShareButton>

        <LinkedinShareButton url={shareUrl} title={shareTitle}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>

        <WhatsappShareButton url={shareUrl} title={shareTitle}>
          <WhatsappIcon size={40} round />
        </WhatsappShareButton>

        <EmailShareButton url={shareUrl} subject={shareTitle} body={`Check out this quiz: ${shareUrl}`}>
          <EmailIcon size={40} round />
        </EmailShareButton>
      </div>

      <p className="text-sm text-gray-600 text-center mt-4">
        Share and challenge your friends!
      </p>
    </motion.div>
  );
}