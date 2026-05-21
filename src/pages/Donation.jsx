import React from "react";
import { motion } from "framer-motion";
import { pageVariants, pageTransition, sectionVariants } from "../constants/motionVariants";
import { Typography, Card, CardContent, Tabs, Tab, Box, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem } from "@mui/material";
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`donation-tabpanel-${index}`} aria-labelledby={`donation-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 4 }}>{children}</Box>}
    </div>
  );
}

function Donation() {
  const [method, setMethod] = React.useState(0);

  const allocation = [
    { category: "Education Expansion", percent: 40 },
    { category: "Food & Nutrition", percent: 25 },
    { category: "Medical Assistance", percent: 20 },
    { category: "Operations & Admin", percent: 10 },
    { category: "Audit & Compliance", percent: 5 },
  ];

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" transition={pageTransition} className="py-24 min-h-screen bg-gray-50/50">
      
      <div className="max-w-4xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <VolunteerActivismIcon color="primary" sx={{ fontSize: 40 }} />
          </div>
          <Typography variant="h2" component="h1" sx={{ fontWeight: 800, color: 'primary.main', mb: 3, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
            Make a Difference Today
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.6 }}>
            Your donation helps provide clean water, education, and essential support to communities in need.
          </Typography>
        </motion.div>

        <Card elevation={0} sx={{ borderRadius: 6, boxShadow: '0 20px 40px rgba(0,0,0,0.08)', mb: 16, border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.50' }}>
            <Tabs value={method} onChange={(e, val) => setMethod(val)} aria-label="donation methods" centered variant="fullWidth">
              <Tab icon={<QrCode2Icon />} label="UPI Payment" sx={{ py: 3, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }} />
              <Tab icon={<CreditCardIcon />} label="Card" sx={{ py: 3, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }} />
              <Tab icon={<AccountBalanceIcon />} label="Net Banking" sx={{ py: 3, fontWeight: 700, textTransform: 'none', fontSize: '1rem' }} />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 0 }}>
            <TabPanel value={method} index={0}>
              <div className="text-center py-8">
                <Box sx={{ display: 'inline-block', p: 4, bgcolor: 'gray.50', borderRadius: 4, border: '2px dashed rgba(0,0,0,0.1)' }}>
                  <QrCode2Icon sx={{ fontSize: 120, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, color: 'text.primary' }}>Scan QR Code</Typography>
                  <Typography variant="caption" color="text.secondary">or use UPI ID: trust@upi</Typography>
                </Box>
              </div>
            </TabPanel>

            <TabPanel value={method} index={1}>
              <form className="space-y-6 max-w-md mx-auto py-4">
                <TextField fullWidth label="Name on Card" variant="outlined" InputProps={{ sx: { borderRadius: 3 } }} />
                <TextField fullWidth label="Card Number" variant="outlined" InputProps={{ sx: { borderRadius: 3 } }} />
                <div className="flex gap-4">
                  <TextField fullWidth label="MM/YY" variant="outlined" InputProps={{ sx: { borderRadius: 3 } }} />
                  <TextField fullWidth label="CVV" variant="outlined" type="password" InputProps={{ sx: { borderRadius: 3 } }} />
                </div>
              </form>
            </TabPanel>

            <TabPanel value={method} index={2}>
              <div className="max-w-md mx-auto py-8">
                <Typography variant="body2" sx={{ fontWeight: 600, mb: 2 }}>Select your bank</Typography>
                <TextField select fullWidth label="Bank" defaultValue="" InputProps={{ sx: { borderRadius: 3 } }}>
                  <MenuItem value="hdfc">HDFC Bank</MenuItem>
                  <MenuItem value="sbi">State Bank of India</MenuItem>
                  <MenuItem value="icici">ICICI Bank</MenuItem>
                  <MenuItem value="axis">Axis Bank</MenuItem>
                </TextField>
              </div>
            </TabPanel>

            <Box sx={{ px: 4, pb: 6, textAlign: 'center' }}>
              <Button variant="contained" color="primary" size="large" sx={{ px: 8, py: 1.5, borderRadius: 8, fontWeight: 700, textTransform: 'none', fontSize: '1.1rem', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}>
                Donate Securely
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Allocation transparency */}
        <motion.section variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <Typography variant="h4" component="h2" align="center" sx={{ fontWeight: 800, color: 'primary.main', mb: 6 }}>
            Financial Allocation Breakdown
          </Typography>
          
          <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <Table sx={{ minWidth: 500 }} aria-label="allocation table">
              <TableHead sx={{ bgcolor: 'primary.50' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1rem' }}>Category</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, color: 'primary.main', fontSize: '1rem' }}>Percentage</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allocation.map((row) => (
                  <TableRow key={row.category} sx={{ '&:last-child td, &:last-child th': { border: 0 }, '&:hover': { bgcolor: 'gray.50' } }}>
                    <TableCell component="th" scope="row" sx={{ fontWeight: 500, color: 'text.secondary' }}>{row.category}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, color: 'text.primary' }}>{row.percent}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Typography variant="caption" sx={{ display: 'block', mt: 3, textAlign: 'center', color: 'text.disabled', px: 4 }}>
            Example: A ₹10,000 donation is typically split as ₹4,000 education, ₹2,500 food, ₹2,000 medical, ₹1,000 operations and ₹500 audit.
          </Typography>
        </motion.section>

      </div>
    </motion.div>
  );
}

export default Donation;
