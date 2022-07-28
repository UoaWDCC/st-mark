import React, { useState } from "react";
import {
  Typography,
  Paper,
  TextField,
  Button,
  Snackbar,
  SnackbarContent,
  FormControl,
  FormHelperText,
} from "@mui/material";
import NavBarDirectory from "../../components/common/NavBarDirectory/indexDirectory";
import styles from "./SubmissionPage.module.css";
import Captcha from "../../auth/Captcha";
import { useHistory, useParams } from "react-router-dom";
import useGet from "../../hooks/useGet";
import { IPersonAll } from "../../types/schema";
import Spinner from "../../components/common/Spinner";
import Error from "../../components/common/Error";
import {
  ProfileError,
  ServerError,
} from "../../components/common/Error/ErrorUtils";
import ConfirmationModal from "../../components/common/ConfirmationModal";
import SuccessModal from "../../components/common/SuccessModal";
import useNoAuthPost from "../../hooks/useNoAuthPost";
import usePageTitle from "../../hooks/usePageTitle";

const SubmissionPage: React.FC = () => {
  usePageTitle("Submit Information");

  // Person information fetching logic
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const {
    data: person,
    isLoading,
    status,
  } = useGet<IPersonAll>(`/api/person/${id}`);

  // Form related state and logic
  const [name, setName] = useState<string>("");
  const [emailAddress, setEmailAddress] = useState<string>("");
  const [emailContent, setEmailContent] = useState<string>("");
  const emailValidationRegex = /\S+@\S+\.\S+/;
  const nameValidationRegex = /\S/;

  // Captcha state and functions
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const setToken = (token: string | null) => {
    setCaptchaToken(token);
  };

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMsg, setSnackbarMsg] = useState<string>("");

  // Reset modal state and related handler functions
  // (Relates to the model which opens when the 'Cancel'
  // button on the form is clicked)
  const [resetModalOpen, setResetModalOpen] = useState<boolean>(false);
  const handleResetModalCancel = () => {
    setResetModalOpen(false);
  };

  const handleResetModalConfirm = async () => {
    history.push(`/profile/${person?._id}`);
  };

  // Successful submit modal state and related handler functions
  const [successfulSubmitModalOpen, setSuccessfulSubmitModalOpen] =
    useState<boolean>(false);
  const handleSuccessModalOk = () => {
    setSuccessfulSubmitModalOpen(false);
    history.push(`/profile/${person?._id}`);
  };

  // Logic for handling submit button press
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const post = useNoAuthPost();
  const handleSubmit = async () => {
    setEmailSending(true);
    const { status } = await post(`/api/submission`, {
      name,
      email: emailAddress,
      content: emailContent,
      profileName: person?.fullName,
      profileID: id,
      token: captchaToken,
    });
    setEmailSending(false);
    if (status === 201) {
      setSuccessfulSubmitModalOpen(true);
    } else {
      setSnackbarMsg("Failed to send message. Please try again.");
      setSnackbarOpen(true);
    }
  };

  return (
    <div className={styles.fullPageContainer}>
      <NavBarDirectory />
      {person && (
        <>
          <Paper
            className={styles.submissionDescription}
            data-testid="submission-description"
          >
            <Typography variant="h6" color="secondary">
              Contributing to this project
            </Typography>
            <div>
              <i>
                <p>
                  Disclaimer: In the third chapter of his letter, St James
                  asserts that <q>all of us make many mistakes.</q> (Jas 3:2a) .
                  It is likely, then, that despite our best efforts, there are
                  errors in the information contained within this site.
                </p>
                <p>
                  It is important to note that any information you provide will
                  be used for the public to view.
                </p>
              </i>
              <p>
                This graveyard project is a work in progress. It will develop -
                and hopefully flourish - as individuals come forward to
                contribute information about their ancestors buried at St
                Mark`s.
              </p>
              <p>
                If you would like to add new information, or correct any
                erroneous information, please contact us using the form below
                and provide a description of the sort of information you have.
                The site administrator will endeavour to respond to your message
                within 24 hours, and a dialogue can begin. Thank you for your
                help and contribution.
              </p>
            </div>
          </Paper>
          <Paper className={styles.formContainer}>
            <div
              className={styles.horizontalGroups}
              data-testid="changes-suggested-for"
            >
              {/* Using two components here to have some space to the left
            of the name of the person */}
              <Typography color="secondary">Changes suggested for:</Typography>
              <Typography variant="h6" color="secondary">
                {person.fullName}
              </Typography>
            </div>
            <div className={styles.horizontalGroups} data-testid="at-plot">
              <Typography color="secondary">At graveyard plot:</Typography>
              <Typography variant="h6" color="secondary">
                {person.plot
                  ? `${person.plot.plotNumber} - ${person.plot.registeredName}`
                  : "Unknown"}
              </Typography>
            </div>
            <div data-testid="change-suggestions">
              <Typography color="secondary">Change Suggestions</Typography>
              <TextField
                placeholder="Enter your message here"
                inputProps={{ "aria-label": "biography-field" }}
                onChange={(e) => setEmailContent(e.target.value)}
                fullWidth
                color="secondary"
                multiline
                minRows={12}
                maxRows={12}
                className={styles.textField}
              />
            </div>
            <div
              className={styles.horizontalGroups}
              data-testid="submitter-name"
            >
              <Typography
                variant="h6"
                color="secondary"
                className={styles.title}
              >
                Your name:
              </Typography>
              <FormControl fullWidth>
                <TextField
                  label="Name"
                  inputProps={{ "aria-label": "first-name-field" }}
                  required
                  onChange={(e) => setName(e.target.value)}
                  color="secondary"
                  className={styles.textField}
                />
                {name !== "" && !nameValidationRegex.test(name) && (
                  <FormHelperText error={true}>
                    Name cannot comprise only empty whitespace
                  </FormHelperText>
                )}
              </FormControl>
            </div>
            <div
              className={styles.horizontalGroups}
              data-testid="submitter-email"
            >
              <Typography
                variant="h6"
                color="secondary"
                className={styles.title}
              >
                Your email:
              </Typography>
              <FormControl fullWidth>
                <TextField
                  label="Email"
                  inputProps={{ "aria-label": "first-name-field" }}
                  required
                  onChange={(e) => setEmailAddress(e.target.value)}
                  error={
                    emailAddress !== "" &&
                    !emailValidationRegex.test(emailAddress)
                  }
                  color="secondary"
                  className={styles.textField}
                />
                {emailAddress !== "" &&
                  !emailValidationRegex.test(emailAddress) && (
                    <FormHelperText error={true}>
                      Please enter a valid email
                    </FormHelperText>
                  )}
              </FormControl>
            </div>

            <div className={styles.captchaContainer} data-testid="captcha">
              <div>
                <Typography>Please verify that you are not a robot</Typography>
                <Captcha onChange={setToken} />
              </div>
            </div>

            <div className={styles.buttonsContainer}>
              <Button
                variant="contained"
                onClick={() => setResetModalOpen(true)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => handleSubmit()}
                disabled={
                  !name ||
                  !emailAddress ||
                  !emailContent ||
                  !captchaToken ||
                  !emailValidationRegex.test(emailAddress) ||
                  !nameValidationRegex.test(name) ||
                  emailSending
                }
              >
                Submit
              </Button>
            </div>
          </Paper>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
          >
            <SnackbarContent message={snackbarMsg} />
          </Snackbar>
          <ConfirmationModal
            message={`Proceeding will erase all the data entered in the form. Are you sure you want to proceed?`}
            confirmButtonText="Confirm"
            open={resetModalOpen}
            onConfirm={handleResetModalConfirm}
            onClose={handleResetModalCancel}
          />
          <SuccessModal
            message={`Your message has been successfully sent. Click OK to go back to the profile.`}
            open={successfulSubmitModalOpen}
            onClose={handleSuccessModalOk}
          />
        </>
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

export default SubmissionPage;
