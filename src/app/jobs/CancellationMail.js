import Mail from '../../lib/Mail';

class CancellationMail {
    get key() {
        return 'CancellationMail';
    }

    async handle({ data }) {
        const { order } = data;
        console.log('A fila executou');
        await Mail.sendMail({
            to: `${order.deliveryman_id.name}<${order.deliveryman_id.email}`,
            subject: 'Nova encomenda disponível',
            template: 'cancellation',
            context: {
                deliveryman_name: order.deliveryman_id.nome,
                client_product: order.product,
            },
        });
    }
}

export default new CancellationMail();
