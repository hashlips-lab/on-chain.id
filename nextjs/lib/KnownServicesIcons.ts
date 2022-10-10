import { StaticImageData } from 'next/image';
import FacebookIcon from '../assets/images/icon/facebook.svg';
import GitLabIcon from '../assets/images/icon/gitlab.svg';
import HashLipsIcon from '../assets/images/icon/hashlips.svg';
import UnknownIcon from '../assets/images/icon/hashlips.svg';

const ICONS = {
  Facebook: FacebookIcon,
  GitLab: GitLabIcon,
  HashLips: HashLipsIcon,
};

export default new Proxy(ICONS, {
  get: (icons, key: keyof typeof ICONS) => {
    if (key in icons) {
      return icons[key];
    }

    return UnknownIcon;
  },
}) as { [key: string]: StaticImageData };
