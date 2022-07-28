import React, { useState } from "react";
import { Button, useMediaQuery } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import NavBarDirectory from "../../components/common/NavBarDirectory/indexDirectory";
import NavigationBar from "../../components/Profile/NavigationBar";
import useGet from "../../hooks/useGet";
import { IPersonAll } from "../../types/schema";
import styles from "./ProfilePage.module.css";
import BasicInfo from "../../components/Profile/BasicInfo";
import PlotMemberDisplay from "../../components/Profile/PlotMemberDisplay";
import Spinner from "../../components/common/Spinner";
import Error from "../../components/common/Error";
import {
  ProfileError,
  ServerError,
} from "../../components/common/Error/ErrorUtils";
import { Biography } from "../../components/Profile/Biography";
import { Images } from "../../components/Profile/Images";
import { Anecdotes } from "../../components/Profile/Anecdotes";
import { Links } from "../../components/Profile/Links";
import usePageTitle from "../../hooks/usePageTitle";

const tabNames = ["biography", "images", "anecdotes", "links"];

const ProfilePage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const { id } = useParams<{ id: string }>();
  const {
    data: person,
    isLoading,
    status,
  } = useGet<IPersonAll>(`/api/person/${id}`);

  usePageTitle(person?.fullName);

  const maxMobileWidth = 890;
  const isMobile = useMediaQuery(`(max-width: ${maxMobileWidth}px)`);

  return (
    <div className={styles.fullPageContainer}>
      <NavBarDirectory />
      {person && (
        <div className={styles.profileContainer}>
          <div className={styles.profileColumn}>
            <BasicInfo person={person} />
            <PlotMemberDisplay
              plotMembers={person.plotMembers}
              plotNumber={person.plot?.plotNumber}
            />
          </div>
          <div className={styles.profileContentContainer}>
            {!isMobile && (
              <div className={styles.tabAndSubmissionContainer}>
                <div className={styles.tabNavBar}>
                  <NavigationBar
                    value={tabValue}
                    setValue={setTabValue}
                    tabNames={tabNames}
                  />
                </div>

                <Button
                  variant="contained"
                  className={styles.submissionContainer}
                  component={Link}
                  to={`/profile/${person._id}/submission`}
                  data-testid="submission-button"
                >
                  Submit Info
                </Button>
              </div>
            )}

            {(tabValue === 0 || isMobile) && (
              <Biography
                className={styles.profileContent}
                biography={person.biography}
                showTitle={isMobile}
              />
            )}
            {(tabValue === 1 || isMobile) && (
              <Images
                className={styles.profileContent}
                images={person.images}
                showTitle={isMobile}
              />
            )}
            {(tabValue === 2 || isMobile) && (
              <Anecdotes
                className={styles.profileContent}
                anecdotes={person.anecdotes}
                showTitle={isMobile}
              />
            )}
            {(tabValue === 3 || isMobile) && (
              <Links
                className={styles.profileContent}
                links={person.links}
                showTitle={isMobile}
              />
            )}
          </div>
          {isMobile && (
            <div>
              <Button
                variant="contained"
                className={styles.submissionContainer}
                component={Link}
                to={`/profile/${person._id}/submission`}
                data-testid="submission-button"
              >
                Submit Info
              </Button>
            </div>
          )}
        </div>
      )}
      {isLoading && <Spinner />}
      {!!status && status >= 400 && status < 500 && (
        <Error
          message={ProfileError}
          director={{
            url: "/directory",
            prompt: "Return to directory",
          }}
        />
      )}
      {!!status && status >= 500 && <Error message={ServerError} />}
    </div>
  );
};

export default ProfilePage;
