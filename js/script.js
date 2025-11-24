// Menu Mobile
document.querySelector('.mobile-menu').addEventListener('click', function() {
    document.querySelector('nav ul').classList.toggle('active');
});

// Formulário de Contato
// Adicionado um check para garantir que o elemento exista antes de adicionar o listener
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Enviar e-mail usando EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
            from_name: document.getElementById('name').value,
            from_email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            message: document.getElementById('message').value
        })
        .then(function(response) {
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            contactForm.reset();
        }, function(error) {
            alert('Erro ao enviar mensagem. Tente novamente.');
            console.error('Erro:', error);
        });
    });
}


// Formulário de Newsletter
// Adicionado um check para garantir que o elemento exista antes de adicionar o listener
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Enviar e-mail usando EmailJS
        emailjs.send("YOUR_SERVICE_ID", "YOUR_NEWSLETTER_TEMPLATE_ID", {
            newsletter_email: document.querySelector('#newsletterForm input[type="email"]').value
        })
        .then(function(response) {
            alert('Obrigado por se inscrever em nossa newsletter!');
            newsletterForm.reset();
        }, function(error) {
            alert('Erro ao se inscrever. Tente novamente.');
            console.error('Erro:', error);
        });
    });
}

// Função para copiar texto para a área de transferência
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Número copiado: ' + text);
    }, function(err) {
        console.error('Erro ao copiar: ', err);
    });
}


// Smooth Scrolling para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if(targetId === '#') return;

        // Modificado para funcionar entre páginas
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        } else if (window.location.pathname.includes('rastreamento.html')) {
            window.location.href = 'index.html' + targetId;
        }
    });
});

// --- INICIALIZAÇÃO DE FUNCIONALIDADES ---

// --- AUTOCOMPLETE PARA ENDEREÇOS ---

function addAutocompleteListener(input) {
    let debounceTimer;
    input.addEventListener('input', async function() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const query = this.value.trim();
            const listId = this.getAttribute('list');
            const datalist = document.getElementById(listId);
            
            // Limpar sugestões anteriores
            let suggestionDiv = input.nextElementSibling;
            if (suggestionDiv && (suggestionDiv.classList.contains('cep-suggestion') || suggestionDiv.classList.contains('address-suggestions'))) {
                suggestionDiv.remove();
            }
            
            if (query.length < 3) {
                datalist.innerHTML = '';
                return;
            }

            let suggestions = [];

            // Verificar se é CEP
            const cepRegex = /^\d{5}-?\d{3}$/;
            if (cepRegex.test(query)) {
                try {
                    const cep = query.replace('-', '');
                    const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const cepData = await viaCepResponse.json();
                    if (!cepData.erro) {
                        const address = `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}, Brasil`;
                        suggestions.push(address);
                    }
                } catch (error) {
                    console.error('Erro ao buscar sugestões do CEP:', error);
                }
            } else {
                // Buscar sugestões via Nominatim
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=BR&limit=5`);
                    const data = await response.json();
                    suggestions = data.map(item => item.display_name);
                } catch (error) {
                    console.error('Erro ao buscar sugestões de endereço:', error);
                }
            }

            datalist.innerHTML = '';

            if (suggestions.length > 0) {
                // Criar div para sugestões
                suggestionDiv = document.createElement('div');
                suggestionDiv.classList.add('address-suggestions');
                suggestionDiv.style.cssText = 'margin-top: 5px; max-height: 150px; overflow-y: auto; border: 1px solid #ddd; border-radius: 4px; background: white; z-index: 10; position: absolute; width: 100%; box-shadow: 0 2px 4px rgba(0,0,0,0.1);';

                suggestions.forEach(suggestion => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = suggestion;
                    suggestionItem.style.cssText = 'padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;';
                    suggestionItem.onmouseover = () => suggestionItem.style.background = '#f8f9fa';
                    suggestionItem.onmouseout = () => suggestionItem.style.background = 'white';
                    suggestionItem.onclick = () => {
                        input.value = suggestion;
                        suggestionDiv.remove();
                        datalist.innerHTML = '';
                    };
                    suggestionDiv.appendChild(suggestionItem);
                });

                // Posicionar abaixo do input
                input.parentNode.style.position = 'relative';
                input.parentNode.insertBefore(suggestionDiv, input.nextSibling);
            }
        }, 300); // Debounce de 300ms
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DA CALCULADORA DE FRETE ---
    const freightForm = document.getElementById('freight-calculator-form');
    if (freightForm) {
        const addWaypointBtn = document.getElementById('add-waypoint-btn');
        const waypointsContainer = document.getElementById('waypoints-container');
        let waypointIndex = 0;

        addWaypointBtn.addEventListener('click', () => {
            waypointIndex++;
            const waypointDiv = document.createElement('div');
            waypointDiv.className = 'form-row waypoint-item';
            waypointDiv.innerHTML = `
                <div class="form-group">
                    <label for="waypoint-${waypointIndex}">Parada ${waypointIndex}</label>
                    <input type="text" id="waypoint-${waypointIndex}" class="waypoint-address" placeholder="CEP ou Endereço da parada" list="waypoint-suggestions-${waypointIndex}" required>
                    <datalist id="waypoint-suggestions-${waypointIndex}"></datalist>
                </div>
                <button type="button" class="remove-waypoint-btn btn-danger"><i class="fas fa-times"></i></button>
            `;
            waypointsContainer.appendChild(waypointDiv);

            // Add autocomplete to the new input
            const newInput = waypointDiv.querySelector('.waypoint-address');
            addAutocompleteListener(newInput);

            waypointDiv.querySelector('.remove-waypoint-btn').addEventListener('click', function() {
                this.parentElement.remove();
            });
        });

        freightForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateAndDisplayRoute();
        });

        // Adicionar botão de cancelar
        const submitBtn = freightForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'btn btn-danger';
            cancelBtn.textContent = 'Reiniciar Cálculo de Frete';
            cancelBtn.style.marginTop = '10px';
            cancelBtn.style.padding = '15px 30px';
            cancelBtn.style.fontSize = '0.9rem';
            cancelBtn.onclick = () => {
                freightForm.reset();
                document.querySelectorAll('.waypoint-item').forEach(item => item.remove());
                document.getElementById('calculator-result').style.display = 'none';
                document.querySelectorAll('datalist').forEach(dl => dl.innerHTML = '');
                document.querySelectorAll('.cep-suggestion').forEach(s => s.remove());
            };
            submitBtn.parentNode.appendChild(cancelBtn);
        }
    }

    // --- LÓGICA DE RASTREAMENTO ---
    const trackingForm = document.getElementById('tracking-form');
    if (trackingForm) {
        trackingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const trackingCode = document.getElementById('tracking-code').value.trim().toUpperCase();
            const resultContainer = document.getElementById('tracking-result');
            const resultText = document.getElementById('tracking-result-text');

            if (!trackingCode) {
                alert('Por favor, insira um código de rastreamento.');
                return;
            }

            resultText.innerHTML = 'Buscando...';
            resultContainer.style.display = 'block';

            setTimeout(() => {
                let statusMessage = '';
                switch (trackingCode) {
                    case 'CB123456789BR':
                        statusMessage = `<strong>Código:</strong> ${trackingCode}<br><strong>Status:</strong> Em trânsito<br><strong>Última atualização:</strong> 23/11/2025 14:30 - O objeto saiu para entrega ao destinatário.<br><strong>Origem:</strong> São Paulo, SP<br><strong>Destino:</strong> Rio de Janeiro, RJ`;
                        break;
                    case 'CB987654321BR':
                        statusMessage = `<strong>Código:</strong> ${trackingCode}<br><strong>Status:</strong> Entregue<br><strong>Data da entrega:</strong> 22/11/2025 18:00<br><strong>Recebido por:</strong> Maria Silva<br><strong>Origem:</strong> Curitiba, PR<br><strong>Destino:</strong> Porto Alegre, RS`;
                        break;
                    case 'CB000000000BR':
                        statusMessage = `<strong>Código:</strong> ${trackingCode}<br><strong>Status:</strong> Postado<br><strong>Data da postagem:</strong> 21/11/2025 10:00<br><strong>Origem:</strong> Belo Horizonte, MG<br><strong>Destino:</strong> Salvador, BA`;
                        break;
                    default:
                        statusMessage = `Nenhuma informação encontrada para o código <strong>${trackingCode}</strong>. Verifique o código e tente novamente.`;
                        break;
                }
                resultText.innerHTML = statusMessage;
                resultContainer.scrollIntoView({ behavior: 'smooth' });
            }, 1500);
        });
    }

    // Adicionar autocomplete aos inputs fixos
    const fixedInputs = document.querySelectorAll('#origin, #destination');
    fixedInputs.forEach(input => addAutocompleteListener(input));
});


// --- FUNÇÕES DA CALCULADORA DE FRETE ---

async function getCoordsFromAddress(address) {
    if (!address) return null;

    // Verificar se é CEP brasileiro
    const cepRegex = /^\d{5}-?\d{3}$/;
    let searchAddress = address;

    if (cepRegex.test(address.trim())) {
        // Buscar endereço via ViaCEP
        try {
            const cep = address.replace('-', '');
            const viaCepResponse = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const cepData = await viaCepResponse.json();
            if (!cepData.erro) {
                searchAddress = `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade}, ${cepData.uf}, Brasil`;
            }
        } catch (error) {
            console.error('Erro ao buscar endereço do CEP:', error);
        }
    }

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchAddress)}&countrycodes=BR&limit=1`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        } else {
            return null; // Endereço não encontrado
        }
    } catch (error) {
        console.error('Erro ao geocodificar endereço:', error);
        return null;
    }
}


async function calculateAndDisplayRoute() {
    const originInput = document.getElementById('origin');
    const destinationInput = document.getElementById('destination');

    if (!originInput || !destinationInput) {
        alert('Erro: Campos de endereço não encontrados.');
        return;
    }

    const originAddress = originInput.value.trim();
    const destinationAddress = destinationInput.value.trim();
    const waypointInputs = document.querySelectorAll('.waypoint-address');

    if (!originAddress || !destinationAddress) {
        alert('Por favor, preencha os endereços de origem e destino.');
        return;
    }

    // Mostrar loading
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading-overlay';
    loadingDiv.innerHTML = `
        <div style="text-align: center; background: rgba(255, 255, 255, 0.95); padding: 40px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); max-width: 400px; margin: 0 auto;">
            <div class="spinner" style="margin-bottom: 20px;"></div>
            <h3 style="color: var(--primary); margin-bottom: 10px;">Calculando Rota</h3>
            <p style="color: #666;">Aguarde enquanto processamos sua solicitação...</p>
            <div class="progress-bar" style="width: 100%; height: 4px; background: #eee; border-radius: 2px; margin-top: 20px; overflow: hidden;">
                <div class="progress-fill" style="height: 100%; background: var(--primary); width: 0%; animation: progress 3s ease-out forwards;"></div>
            </div>
        </div>
    `;
    loadingDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s ease-out;';
    document.body.appendChild(loadingDiv);

    const addresses = [originAddress, ...Array.from(waypointInputs).map(input => input.value), destinationAddress];
    
    try {
        const coordsPromises = addresses.map(getCoordsFromAddress);
        const coordinates = await Promise.all(coordsPromises);

        const invalidAddressIndex = coordinates.findIndex(coord => coord === null);
        if (invalidAddressIndex !== -1) {
            alert(`Não foi possível encontrar o endereço: "${addresses[invalidAddressIndex]}". Por favor, verifique e tente novamente.`);
            return;
        }

        // Usar OSRM para calcular a distância real por estrada
        const coordsString = coordinates.map(coord => `${coord.lon},${coord.lat}`).join(';');
        const osrmUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${coordsString}?overview=false&steps=false`;
        
        const response = await fetch(osrmUrl);
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
            let totalDistanceKm = data.routes[0].distance / 1000; // Converter metros para km
            
            // Ajustar distância para retorno
            const returnType = document.getElementById('return-type').value;
            if (returnType === 'empty' || returnType === 'loaded') {
                totalDistanceKm *= 2;
            }
            
            calculateCost(totalDistanceKm);
        } else {
            alert('Não foi possível calcular a rota. Verifique os endereços ou tente novamente.');
        }

    } catch (error) {
        alert('Ocorreu um erro ao calcular a rota. Verifique sua conexão e tente novamente.');
        console.error("Erro no cálculo de rota:", error);
    } finally {
        // Esconder loading
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}


function calculateCost(distanceKm) {
    const vehicleCostPerKm = parseFloat(document.getElementById('vehicle-type').value);
    const vehicleCount = parseInt(document.getElementById('vehicle-count').value, 10);
    const weight = parseFloat(document.getElementById('cargo-weight').value) || 0;
    const volume = parseFloat(document.getElementById('cargo-volume').value) || 0;
    const returnType = document.getElementById('return-type').value;

    // Cálculo conforme Resolução ANTT nº 5.867/2020, atualizada pela Res. nº 6.067/25
    // Frete mínimo aproximado: (Distância x Tarifa por km) + (Peso x Coeficiente de Peso) + Taxas fixas

    let baseCost = distanceKm * vehicleCostPerKm * vehicleCount;

    // Ajuste por tipo de retorno
    if (returnType === 'empty') {
        baseCost /= 2; // Retorno vazio não cobra pelo trecho vazio
    } else if (returnType === 'loaded') {
        // Mantém o custo total para retorno com carga
    } // Para 'none', custo normal

    // Coeficiente de Peso: R$ 0.015 por kg
    baseCost += weight * 0.015;

    // Ajuste por volume se informado (aproximado)
    if (volume > 0) {
        baseCost += volume * 5; // R$ 5 por m³
    }

    // Taxas de coleta e entrega (fixas por veículo)
    const taxaColetaEntrega = 50; // R$ 50 por veículo
    baseCost += taxaColetaEntrega * vehicleCount;

    // Ajuste por paradas intermediárias
    const waypointCount = document.querySelectorAll('.waypoint-item').length;
    const waypointMultiplier = 1 + (waypointCount * 0.2); // 20% adicional por parada

    const finalCost = baseCost * waypointMultiplier;

    displayResult(finalCost, distanceKm);
}

function displayResult(cost, distance) {
    const resultContainer = document.getElementById('calculator-result');
    const resultText = document.getElementById('result-text');

    const formattedCost = cost.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formattedDistance = distance.toFixed(2).replace('.', ',') + ' km';

    // Coletar dados para contato
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const waypoints = Array.from(document.querySelectorAll('.waypoint-address')).map(input => input.value);
    const vehicleType = document.getElementById('vehicle-type').options[document.getElementById('vehicle-type').selectedIndex].text;
    const vehicleCount = document.getElementById('vehicle-count').value;
    const weight = document.getElementById('cargo-weight').value || 'Não informado';
    const volume = document.getElementById('cargo-volume').value || 'Não informado';
    const returnType = document.getElementById('return-type').options[document.getElementById('return-type').selectedIndex].text;

    const message = `Olá, solicito uma cotação de frete.\n\nOrigem: ${origin}\nDestino: ${destination}\n${waypoints.length > 0 ? 'Paradas: ' + waypoints.join(', ') + '\n' : ''}Veículo: ${vehicleType}\nQuantidade: ${vehicleCount}\nPeso: ${weight} kg\nVolume: ${volume} m³\nRetorno: ${returnType}\nDistância estimada: ${formattedDistance}\nValor estimado: ${formattedCost}\n\nSimulação inicial da calculadora.`;

    const whatsappUrl = `https://wa.me/5511989140405?text=${encodeURIComponent(message)}`;
    const emailUrl = `mailto:contato@cargoblue.com.br?subject=Cotação de Frete&body=${encodeURIComponent(message)}`;

    resultText.innerHTML = `
        <div class="result-main-card">
            <div class="result-header">
                <div class="result-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div>
                    <h3>Cálculo Realizado com Sucesso</h3>
                    <p>Confira os detalhes da sua simulação</p>
                </div>
            </div>

            <div class="result-price-section">
                <div class="price-display">
                    <div class="price-label">Valor Estimado</div>
                    <div class="price-value">${formattedCost}</div>
                    <div class="price-subtitle">conforme regulamentação ANTT</div>
                </div>
                <div class="distance-info">
                    <i class="fas fa-route"></i>
                    <span>${formattedDistance}</span>
                </div>
            </div>

            <div class="result-details-grid">
                <div class="detail-card">
                    <div class="detail-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="detail-content">
                        <h4>Origem</h4>
                        <p>${origin}</p>
                    </div>
                </div>

                <div class="detail-card">
                    <div class="detail-icon">
                        <i class="fas fa-flag-checkered"></i>
                    </div>
                    <div class="detail-content">
                        <h4>Destino</h4>
                        <p>${destination}</p>
                    </div>
                </div>

                ${waypoints.length > 0 ? waypoints.map((waypoint, index) => `
                    <div class="detail-card">
                        <div class="detail-icon">
                            <i class="fas fa-stop-circle"></i>
                        </div>
                        <div class="detail-content">
                            <h4>Parada ${index + 1}</h4>
                            <p>${waypoint}</p>
                        </div>
                    </div>
                `).join('') : ''}

                <div class="detail-card">
                    <div class="detail-icon">
                        <i class="fas fa-truck"></i>
                    </div>
                    <div class="detail-content">
                        <h4>Veículo</h4>
                        <p>${vehicleType}</p>
                        <small>Quantidade: ${vehicleCount}</small>
                    </div>
                </div>

                <div class="detail-card">
                    <div class="detail-icon">
                        <i class="fas fa-boxes"></i>
                    </div>
                    <div class="detail-content">
                        <h4>Carga</h4>
                        <p>Peso: ${weight} kg</p>
                        <small>Volume: ${volume} m³</small>
                    </div>
                </div>

                <div class="detail-card">
                    <div class="detail-icon">
                        <i class="fas fa-undo"></i>
                    </div>
                    <div class="detail-content">
                        <h4>Retorno</h4>
                        <p>${returnType}</p>
                    </div>
                </div>
            </div>

            <div class="result-notice">
                <div class="notice-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="notice-content">
                    <h4>Importante</h4>
                    <p>Este é um valor aproximado baseado em simulação inicial. O valor real pode variar e deve ser confirmado com nossa equipe para uma cotação precisa e personalizada.</p>
                </div>
            </div>

            <div class="result-actions">
                <div class="action-buttons">
                    <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
                        <i class="fab fa-whatsapp"></i>
                        <span>Cotar por WhatsApp</span>
                    </a>
                    <a href="${emailUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-email">
                        <i class="fas fa-envelope"></i>
                        <span>Cotar por E-mail</span>
                    </a>
                </div>
                <button type="button" class="btn btn-outline reset-btn" onclick="resetCalculator()">
                    <i class="fas fa-redo"></i>
                    <span>Novo Cálculo</span>
                </button>
            </div>
        </div>
    `;

    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth' });
}

function resetCalculator() {
    const freightForm = document.getElementById('freight-calculator-form');
    const resultContainer = document.getElementById('calculator-result');

    if (freightForm) {
        freightForm.reset();
        document.querySelectorAll('.waypoint-item').forEach(item => item.remove());
        document.querySelectorAll('datalist').forEach(dl => dl.innerHTML = '');
        document.querySelectorAll('.cep-suggestion').forEach(s => s.remove());
    }

    if (resultContainer) {
        resultContainer.style.display = 'none';
    }
}