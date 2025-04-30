
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}
const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ width: '100%' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <Button color="inherit" onClick={handleGoHome}
        sx={{
          fontSize: '1rem',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: 'rgba(8, 42, 111, 0.88)',
          },
        }}>
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
