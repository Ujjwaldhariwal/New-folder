import { Helmet } from 'react-helmet-async';
import { useTheme } from '@mui/material/styles';
import { Container, Typography } from '@mui/material';

export default function DashboardAppPage() {
  const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Dashboard | MBM </title>
      </Helmet>

      <Container maxwidth="xl" style={{textAlign:'center'}}>
        <Typography variant="h4" sx={{ mt: 35 }}>
          Coming Soon....
        </Typography>
      </Container>
    </>
  );
}
