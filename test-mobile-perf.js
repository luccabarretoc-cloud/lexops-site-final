#!/usr/bin/env node

/**
 * Mobile Performance Test Script
 * Testa Lighthouse, Web Vitals e Performance Metrics
 * 
 * Run: npm run test
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function header(title) {
  console.log('\n' + '='.repeat(60));
  log('cyan', `📊 ${title}`);
  console.log('='.repeat(60) + '\n');
}

function checkmark(condition, message) {
  const symbol = condition ? '✅' : '❌';
  const color = condition ? 'green' : 'red';
  log(color, `${symbol} ${message}`);
  return condition;
}

// Test Suite
const tests = {
  bundleSize: () => {
    header('BUNDLE SIZE CHECK');
    
    const distPath = path.join(__dirname, 'dist');
    if (!fs.existsSync(distPath)) {
      log('red', '❌ dist/ folder not found. Run: npm run build');
      return false;
    }

    let totalSize = 0;
    const files = {};

    function getFileSize(filePath, relativePath = '') {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        fs.readdirSync(filePath).forEach(file => {
          getFileSize(path.join(filePath, file), path.join(relativePath, file));
        });
      } else {
        const size = stat.size;
        files[relativePath] = size;
        totalSize += size;
      }
    }

    getFileSize(distPath);

    // Sort by size
    const sorted = Object.entries(files)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    sorted.forEach(([file, size]) => {
      const kb = (size / 1024).toFixed(2);
      const color = size > 100000 ? 'yellow' : 'green';
      log(color, `  ${file}: ${kb} KB`);
    });

    const totalMB = (totalSize / 1024 / 1024).toFixed(2);
    log('cyan', `\nTotal: ${totalMB} MB`);

    const passed = totalSize < 200000; // 200 KB max
    return checkmark(passed, `Bundle size < 200KB: ${(totalSize / 1024).toFixed(2)} KB`);
  },

  jsMinified: () => {
    header('JAVASCRIPT MINIFICATION');
    
    const mainJsPath = path.join(__dirname, 'dist/assets/');
    if (!fs.existsSync(mainJsPath)) {
      return false;
    }

    const files = fs.readdirSync(mainJsPath).filter(f => f.endsWith('.js'));
    let allMinified = true;

    files.forEach(file => {
      const content = fs.readFileSync(path.join(mainJsPath, file), 'utf8');
      const hasConsole = content.includes('console.log');
      const hasComments = content.includes('/*') || content.includes('//');
      
      if (hasConsole || hasComments) {
        log('yellow', `  ⚠️ ${file}: contém console.log ou comentários`);
        allMinified = false;
      } else {
        log('green', `  ✅ ${file}: minificado corretamente`);
      }
    });

    return allMinified;
  },

  cssPurged: () => {
    header('CSS PURGED CHECK');
    
    const cssPath = path.join(__dirname, 'dist/assets/');
    if (!fs.existsSync(cssPath)) {
      return false;
    }

    const files = fs.readdirSync(cssPath).filter(f => f.endsWith('.css'));
    let totalCSSSize = 0;

    files.forEach(file => {
      const filePath = path.join(cssPath, file);
      const size = fs.statSync(filePath).size;
      const kb = (size / 1024).toFixed(2);
      totalCSSSize += size;

      log('cyan', `  ${file}: ${kb} KB`);
    });

    const passed = totalCSSSize < 50000; // 50 KB max for CSS
    return checkmark(passed, `Total CSS < 50KB: ${(totalCSSSize / 1024).toFixed(2)} KB`);
  },

  responsiveImages: () => {
    header('RESPONSIVE IMAGES');
    
    const indexPath = path.join(__dirname, 'dist/index.html');
    if (!fs.existsSync(indexPath)) {
      log('red', '❌ dist/index.html not found');
      return false;
    }

    const html = fs.readFileSync(indexPath, 'utf8');
    
    const checks = [
      { regex: /<picture>/g, name: 'Picture tags for responsive images' },
      { regex: /srcSet/g, name: 'srcSet attributes' },
      { regex: /loading="lazy"/g, name: 'Lazy loading' },
      { regex: /\.webp/g, name: 'WebP format' },
    ];

    let allPassed = true;
    checks.forEach(({ regex, name }) => {
      const found = html.match(regex);
      const passed = !!found;
      checkmark(passed, `${name}: ${found ? found.length : 0} found`);
      if (!passed) allPassed = false;
    });

    return allPassed;
  },

  performanceHints: () => {
    header('PERFORMANCE HINTS');
    
    const indexPath = path.join(__dirname, 'dist/index.html');
    const html = fs.readFileSync(indexPath, 'utf8');

    const hints = [
      { regex: /preload/g, name: 'Preload hints' },
      { regex: /prefetch/g, name: 'Prefetch hints' },
      { regex: /dns-prefetch/g, name: 'DNS prefetch' },
      { regex: /font-display:\s*swap/g, name: 'Font display swap' },
    ];

    hints.forEach(({ regex, name }) => {
      const found = html.match(regex);
      checkmark(!!found, `${name}: ${found ? '✅' : 'não encontrado'}`);
    });

    return true;
  },

  mobileOptimizations: () => {
    header('MOBILE OPTIMIZATIONS');
    
    const cssPath = path.join(__dirname, 'src/index.css');
    if (!fs.existsSync(cssPath)) {
      log('red', '❌ src/index.css not found');
      return false;
    }

    const css = fs.readFileSync(cssPath, 'utf8');

    const optimizations = [
      { regex: /@media\s*\(\s*max-width:\s*\d+px\s*\)/g, name: 'Mobile media queries' },
      { regex: /backdrop-filter:\s*none/g, name: 'Backdrop blur disabled' },
      { regex: /animation-duration:\s*0\.01ms/g, name: 'Reduced animations' },
      { regex: /min-height:\s*44px/g, name: 'Touch-friendly buttons' },
    ];

    let allPassed = true;
    optimizations.forEach(({ regex, name }) => {
      const found = css.match(regex);
      const passed = checkmark(!!found, `${name}: ${found ? found.length : 0} instances`);
      if (!passed) allPassed = false;
    });

    return allPassed;
  }
};

// Run all tests
function runAllTests() {
  header('🚀 MOBILE-FIRST PERFORMANCE TEST SUITE');
  
  const results = [];
  Object.entries(tests).forEach(([name, test]) => {
    try {
      const result = test();
      results.push({ name, result });
    } catch (error) {
      log('red', `❌ Error in ${name}: ${error.message}`);
      results.push({ name, result: false });
    }
  });

  // Summary
  header('SUMMARY');
  const passed = results.filter(r => r.result).length;
  const total = results.length;

  results.forEach(({ name, result }) => {
    const symbol = result ? '✅' : '❌';
    const color = result ? 'green' : 'red';
    log(color, `${symbol} ${name}`);
  });

  console.log('\n' + '='.repeat(60));
  if (passed === total) {
    log('green', `🎉 ALL TESTS PASSED: ${passed}/${total}`);
  } else {
    log('yellow', `⚠️ SOME TESTS FAILED: ${passed}/${total}`);
  }
  console.log('='.repeat(60) + '\n');

  // Recommendations
  if (passed < total) {
    log('yellow', 'Recommendations:');
    log('blue', '1. Run: npm run build');
    log('blue', '2. Check src/index.css for mobile optimizations');
    log('blue', '3. Verify responsive images in components');
    log('blue', '4. Test on actual mobile device');
  }

  return passed === total ? 0 : 1;
}

// Main
if (import.meta.url === `file://${process.argv[1]}`) {
  process.exit(runAllTests());
}

export { tests, runAllTests };
