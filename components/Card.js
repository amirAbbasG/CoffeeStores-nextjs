import Link from "next/link";
import Image from "next/image";
import classnames from "classnames";

import styles from "./Card.module.css";

const Card = ({ href, imageUrl, name }) => {
  return (
    <Link href={href}>
      <a className={styles.cardLink}>
        <div className={classnames("glass", styles.container)}>
          <div className={styles.headerBox}>
            <h2 className={styles.header}>{name}</h2>
          </div>
          <div className={styles.imageBox}>
            <Image
              className={styles.image}
              src={imageUrl}
              width={300}
              height={200}
              alt={name}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
