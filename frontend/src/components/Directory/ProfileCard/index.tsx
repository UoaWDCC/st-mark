import React from "react";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import styles from "./ProfileCard.module.css";
import { IDate, IPerson, IPersonAll } from "../../../types/schema";
import useGet from "../../../hooks/useGet";

interface ProfileCardProps {
  person: IPerson;
  onClick: React.MouseEventHandler<HTMLElement>;
  isStyled: boolean;
}

const dayFormatter = (date: IDate | undefined): string => {
  return date?.year?.toString() ?? "Unknown";
};

const ProfileCard: React.FC<ProfileCardProps> = (props: ProfileCardProps) => {
  const { person, onClick: handleClick, isStyled } = props;
  const { fullName, dateOfBirth, dateOfDeath } = person;
  const highlightColor = isStyled
    ? "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)"
    : "";

  const {
    data: person2,
    isLoading,
    status,
  } = useGet<IPersonAll>(`/api/person/${person._id}`);

  const displayImage = person2?.displayImage;
  return (
    <Card>
      <CardActionArea onClick={handleClick} data-testid="profile-card-target">
        <CardContent
          className={styles.cardContent}
          style={{ background: highlightColor }}
        >
          {displayImage ?
            <img
              src={displayImage?.url}
              alt="Profile Picture"
              height="50px"
            /> : <PersonIcon sx={{ fontSize: 35 }} />
          }

          <div>
            <Typography variant="h6" data-testid="name-area">
              {fullName}
            </Typography>
            <Typography variant="body1" data-testid="dob-d">
              {`${dayFormatter(dateOfBirth)} - ${dayFormatter(dateOfDeath)}`}
            </Typography>
          </div>

        </CardContent>
      </CardActionArea>
    </Card>


  );
};

export default ProfileCard;
