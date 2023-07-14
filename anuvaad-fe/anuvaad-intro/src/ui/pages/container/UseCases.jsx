import React, { useEffect } from "react";
import DatasetStyle from "../../styles/Dataset";
import { Typography, Card, Grid, Box, Paper } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import themeDefault from "../theme/theme";
import GavelIcon from "@mui/icons-material/Gavel";
import AssuredWorkloadIcon from "@mui/icons-material/AssuredWorkload";
import SchoolIcon from "@mui/icons-material/School";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import DomainDisabledIcon from "@mui/icons-material/DomainDisabled";
import NewspaperIcon from "@mui/icons-material/Newspaper";

function UseCases() {
  const classes = DatasetStyle();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ margin: "120px 0px 20px 0px" }}>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Card className={classes.useCaseCard}>
          <Typography variant="h4" sx={{mt:3}}>Anuvaad - Use Cases</Typography>
          <Grid sx={{ pl: 6, pr: 6, mb: 5 }}>
            <Typography className={classes.useCaseContent}>
              Document digitization and translation play a crucial role in
              today's digital world , enabling efficient communication and
              accessibility across different languages . However , the
              availability of high-quality resources for document digitization
              and translation can still be limited , leading to challenges in
              accessing accurate and reliable translations.
            </Typography>
            <Typography className={classes.useCaseContent}>
              Anuvaad is an open-source , scalable platform designed to address
              this issue by providing document digitization and translation
              services between English and 12+ Indic languages . It aims to
              ensure that users have access to well-organized and high-quality
              resources for digitizing and translating their documents
              effectively.
            </Typography>
            <Typography className={classes.useCaseContent}>
              Anuvaad utilizes Translation Memory eXchange (TMX) technology ,
              enabling unique translations tailored to various domains such as
              judicial , financial , and more . This ensures that the translated
              documents maintain their context and accuracy , meeting the
              specific requirements of different domains . By leveraging TMX ,
              Anuvaad enhances the quality and precision of document
              translations , providing users with reliable and contextually
              relevant results .
            </Typography>
            <Typography className={classes.useCaseContent}>
              Additionally , Anuvaad acknowledges that certain domains may have
              specialized terminology or phrases . To address this , the
              platform provides an option for users to add specific phrases and
              words with translations that can override default translations .
              These custom entries as TMX entries allow users to ensure that
              translations align with domain-specific requirements , ensuring
              accuracy and consistency in the translated documents .
            </Typography>
            <Typography className={classes.useCaseContent}>
              Currently , prestigious government bodies like the Supreme Court
              and High Courts of India , along with the Supreme Court of
              Bangladesh , are relying on Anuvaad for the translation of
              judgments between English and Indic languages . This demonstrates
              the platform's credibility and its ability to meet the rigorous
              demands of legal document translation .
            </Typography>
            <Typography className={classes.useCaseContent}>
              Anuvaad goes beyond simple document translation by offering
              additional features to enhance user control and customization .
              The platform provides a user-friendly dashboard that allows users
              to view their past translations and digitized documents . Users
              can conveniently access and download these documents as needed ,
              ensuring easy retrieval and reference .
            </Typography>
            <Typography className={classes.useCaseContent}>
              To further cater to user preferences , Anuvaad offers an intuitive
              editor that enables post-translation editing . Users can make
              necessary adjustments to the translated text according to their
              specific needs , ensuring the final document meets their
              expectations and requirements .
            </Typography>
            <Typography
              variant="h5"
              align="left"
              className={classes.usecaseTitle}
              sx={{ mt: 7 }}
            >
              Anuvaad can be used in various sectors as follows:
            </Typography>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ mt: 10 }}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 2 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <GavelIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Legal Sector
                  </Typography>
                  <Typography
                    variant="body1"
                    className={classes.UseCaseContent}
                  >
                    The Anuvaad platform can be extensively used in legal
                    institutions such as courts, law firms, and legal
                    departments of organizations. It facilitates the translation
                    of legal documents, judgments, contracts, and other legal
                    materials between English and Indic languages, ensuring
                    accurate communication and accessibility of legal
                    information.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <AssuredWorkloadIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Government Agencies
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.UseCaseContent}
                  >
                    Government agencies and departments dealing with
                    multilingual documents can benefit from Anuvaad. It can be
                    employed for translating government policies, official
                    documents, public announcements, and other relevant
                    materials into different Indic languages, enabling effective
                    communication with citizens and stakeholders.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <SchoolIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Educational Institutions
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.UseCaseContent}
                  >
                    Anuvaad can be valuable in educational institutions,
                    particularly those offering multilingual education or
                    operating in regions with diverse language backgrounds. It
                    can support the translation of educational content,
                    textbooks, research papers, and administrative documents,
                    facilitating learning and knowledge dissemination across
                    different languages.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <MonetizationOnIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Business and Commerce
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.UseCaseContent}
                  >
                    Companies operating in regions with diverse language
                    requirements can leverage Anuvaad for translation services.
                    It can aid in translating business documents, contracts,
                    marketing materials, product information, and customer
                    communications, enabling effective communication with
                    customers, partners, and employees in different language
                    communities.
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <HealthAndSafetyIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Healthcare and Medical Sector
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.UseCaseContent}
                  >
                    Anuvaad can be utilized in healthcare institutions and
                    medical research organizations. It can support the
                    translation of medical reports, research papers, patient
                    records, and healthcare information between English and
                    Indic languages, facilitating effective communication and
                    accessibility of medical information.
                  </Typography>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <DomainDisabledIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Non-profit Organizations
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.UseCaseContent}
                  >
                    Non-profit organizations working on initiatives in
                    linguistically diverse communities can benefit from Anuvaad.
                    It can assist in translating project proposals, reports,
                    communication materials, and educational resources, ensuring
                    effective engagement and impact in different language
                    groups.
                  </Typography>
                </Grid>
              </Grid>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                sx={{ mt: 4 }}
              >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10}>
                  <NewspaperIcon className={classes.Usecaseimg} />
                  <Typography
                    variant="h5"
                    sx={{ mb: 3, mt: 1 }}
                    className={classes.usecaseSubTitle}
                  >
                    Media and Publishing
                  </Typography>
                  <Typography
                    variant="body2"
                    className={classes.UseCaseContent}
                  >
                    Anuvaad can be employed by media houses, publishers, and
                    content creators to translate articles, news reports, books,
                    and digital content into various Indic languages. It
                    enhances the reach and accessibility of media and published
                    materials to a broader audience.
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Typography className={classes.useCaseContent}>
              Any industry or domain requires accurate document translation and
              digitization.
            </Typography>

            <Typography
              sx={{
                mt: 2,
                textAlign: "left",
                fontSize: "16px",
                color: "#707070",
                lineHeight: "25px",
                textAlign: "justify",
              }}
            >
              In summary, Anuvaad strives to ensure free access to high-quality
              and well-organized open document digitization and translation
              resources. Using TMX technology, specific domain-based
              translations, and its open-source nature, Anuvaad serves as a
              valuable platform for individuals and organizations seeking
              reliable and accurate document digitization and translation
              services between English and Indic languages. With features like a
              translation dashboard, post-translation editing, and the ability
              to add custom translations, Anuvaad empowers users with greater
              control and customization options for their document digitization
              and translation needs.
            </Typography>
          </Grid>
        </Card>
      </Grid>
    </div>
  );
}
export default UseCases;
