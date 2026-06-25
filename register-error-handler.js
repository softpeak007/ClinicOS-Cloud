process.on('uncaughtException', (err) => {
  console.error('\n========================================');
  console.error('DIAGNOSTIC: UNCAUGHT EXCEPTION IN WORKER:');
  console.error(err.stack || err);
  console.error('========================================\n');
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\n========================================');
  console.error('DIAGNOSTIC: UNHANDLED REJECTION IN WORKER:');
  console.error(reason && (reason.stack || reason));
  console.error('========================================\n');
});
